import { html, state, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement } from "@umbraco-cms/backoffice/external/lit";

// Define a constructor type that includes what we need from LitElement
export type Constructor<T = {}> = new (...args: any[]) => T;


export interface ResponsiveValue<T> {
    desktop?: T;
    tablet?: T;
    mobile?: T;
    // Fallback/Legacy
    value?: any;
    enabled?: boolean;
}

export declare class UmbResponsiveMixinInterface<T> {
    currentDevice: 'desktop' | 'tablet' | 'mobile';
    responsiveValue: ResponsiveValue<T>;
    value: string | undefined; // The raw JSON string from Umbraco
    
    // Methods
    renderDeviceSelector(): any;
    getCurrentDeviceValue(): T | undefined;
    getResolvedDeviceValue(): { value: T | undefined, inherited: boolean, source: 'desktop' | 'tablet' | 'mobile' };
    setDeviceValue(val: T): void;
    getResponsiveData(): ResponsiveValue<T>;
}

export const UmbResponsiveMixin = <T, S extends Constructor<LitElement> = Constructor<LitElement>>(superClass: S) => {

    class UmbResponsiveMixinClass extends UmbElementMixin(superClass) {

        protected _currentDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';

        @state()
        protected _responsiveData: ResponsiveValue<T> = {};

        @property({ type: String })
        public value?: string; // No initializer to avoid field shadowing

        protected override willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
            super.willUpdate(changedProperties);

            if (changedProperties.has('value')) {
                this._parseResponsiveValue(this.value);
            }
        }

        protected _parseResponsiveValue(input: string | any) {
            let jsonStr = input;
            
            // Handle object input normalization
            if (typeof jsonStr === 'object' && jsonStr !== null) {
                jsonStr = JSON.stringify(jsonStr);
            }
            jsonStr = String(jsonStr ?? "");

            let parsed: any = null;
            try {
                if (jsonStr && jsonStr.trim().startsWith('{')) {
                    parsed = JSON.parse(jsonStr);
                     if (typeof parsed === 'string' && parsed.trim().startsWith('{')) {
                         try { parsed = JSON.parse(parsed); } catch {}
                     }
                }
            } catch {}
    
            this._responsiveData = {};
    
            if (parsed) {
                const hasResponsiveKeys = !!(parsed.desktop || parsed.tablet || parsed.mobile);
                
                if (hasResponsiveKeys) {
                    if (parsed.desktop) this._responsiveData.desktop = parsed.desktop;
                    if (parsed.tablet) this._responsiveData.tablet = parsed.tablet;
                    if (parsed.mobile) this._responsiveData.mobile = parsed.mobile;
                } else {
                    if (parsed.value !== undefined) {
                         this._responsiveData.desktop = parsed as T; 
                    } else {
                         this._responsiveData.desktop = parsed as T;
                    }
                }
            }
            console.log('[UmbResponsiveMixin] Parsed Data:', this._responsiveData);

            this.requestUpdate();
        }

        protected _save() {
            const newVal = JSON.stringify(this._responsiveData);
            console.log('[UmbResponsiveMixin] Saving Value:', newVal);
            if (this.value !== newVal) {
                this.value = newVal;
                this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
                this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
            }
        }


        public renderDeviceSelector() {
            return html``;
        }
        
        public getCurrentDeviceValue(): T | undefined {
            return this._responsiveData[this._currentDevice];
        }

        public getResolvedDeviceValue(): { value: T | undefined, inherited: boolean, source: 'desktop' | 'tablet' | 'mobile' } {
            const current = this._currentDevice;
            const data = this._responsiveData;

            // Desktop: Always returns explicit value (or undefined)
            if (current === 'desktop') {
                return { value: data.desktop, inherited: false, source: 'desktop' };
            }

            // Tablet: Checks Tablet -> Desktop
            if (current === 'tablet') {
                if (data.tablet !== undefined) {
                    return { value: data.tablet, inherited: false, source: 'tablet' };
                }
                return { value: data.desktop, inherited: true, source: 'desktop' };
            }

            // Mobile: Checks Mobile -> Tablet -> Desktop
            if (current === 'mobile') {
                if (data.mobile !== undefined) {
                    return { value: data.mobile, inherited: false, source: 'mobile' };
                }
                if (data.tablet !== undefined) {
                    return { value: data.tablet, inherited: true, source: 'tablet' };
                }
                return { value: data.desktop, inherited: true, source: 'desktop' };
            }

            return { value: undefined, inherited: false, source: 'desktop' };
        }
        
        public setDeviceValue(val: T) {
            this._responsiveData[this._currentDevice] = val;
            this._save();
            this.requestUpdate();
        }
        
        public getResponsiveData() {
            return this._responsiveData;
        }
    }

    return UmbResponsiveMixinClass as unknown as Constructor<UmbResponsiveMixinInterface<T>> & S;
};
