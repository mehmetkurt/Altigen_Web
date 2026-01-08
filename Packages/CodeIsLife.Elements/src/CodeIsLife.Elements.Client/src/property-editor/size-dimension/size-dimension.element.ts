import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbResponsiveMixin } from '../../mixins/responsive.mixin.js';


interface SizeDimensionValue {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    unit?: string;
    isLinked?: boolean;
}

@customElement('codeislife-size-dimension')
export class CodeIsLifeSizeDimensionElement extends UmbResponsiveMixin<SizeDimensionValue>(UmbElementMixin(LitElement)) {

    // Mixin method declarations
    // Mixin method declarations
    public renderDeviceSelector!: () => any;
    public getCurrentDeviceValue!: () => SizeDimensionValue | undefined;
    public getResolvedDeviceValue!: () => { value: SizeDimensionValue | undefined, inherited: boolean, source: 'desktop' | 'tablet' | 'mobile' };
    public setDeviceValue!: (val: SizeDimensionValue) => void;

    @state()
    private _value: SizeDimensionValue = { unit: 'px', isLinked: true };

    @state()
    private _isInherited: boolean = false;

    @property({ attribute: false })
    public config: any;

    // Remove Manual Value Accessor, Mixin handles it via 'value' property

    protected override updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('_currentDevice') || changedProperties.has('_responsiveData')) {
            this._loadCurrentState();
        }
    }

    private _loadCurrentState() {
        const resolution = this.getResolvedDeviceValue();
        this._isInherited = resolution.inherited;
        // console.log('[SizeDimension] Loading:', resolution);
        
        if (resolution.value) {
            this._value = { 
                unit: 'px', 
                isLinked: true, 
                ...resolution.value 
            };
        } else {
            this._value = { unit: 'px', isLinked: true };
        }
    }

    private _saveCurrentState() {
        // console.log('[SizeDimension] Saving:', this._value);
        this.setDeviceValue(this._value);
    }

    private _update(side: 'top' | 'right' | 'bottom' | 'left', val: string) {
        let cleanVal = val;
        this._isInherited = false; // Breaking inheritance on edit

        // If not custom, only allow numeric values
        if (this._value.unit !== 'custom') {
            const numericRegex = /^-?[0-9]*[.,]?[0-9]*$/;
            if (!numericRegex.test(val) && val !== '') {
                 cleanVal = val.replace(/[^0-9.,-]/g, '');
            }
        }

        let newValue = { ...this._value };

        if (this._value.isLinked) {
            newValue = { 
                ...newValue, 
                top: cleanVal, 
                right: cleanVal, 
                bottom: cleanVal, 
                left: cleanVal 
            };
        } else {
            newValue = { ...newValue, [side]: cleanVal };
        }
        
        this._value = newValue;
        this._saveCurrentState();
    }

    private _toggleLink() {
        this._isInherited = false;
        const newLinked = !this._value.isLinked;
        let newValue = { ...this._value, isLinked: newLinked };
        
        if (newLinked) {
            const syncVal = newValue.top || newValue.right || newValue.bottom || newValue.left || "";
            newValue = {
                ...newValue,
                top: syncVal,
                right: syncVal,
                bottom: syncVal,
                left: syncVal
            };
        }
        
        this._value = newValue;
        this._saveCurrentState();
    }

    private _onUnitChange(e: CustomEvent) {
        e.stopPropagation();
        this._isInherited = false;
        this._value = { ...this._value, unit: e.detail.value };
        this._saveCurrentState();
    }

    render() {
        const inputType = this._value.unit === 'custom' ? 'text' : 'number';

        return html`
            <div class="size-dimension-wrapper">
                
                <div class="header-controls">

                    <codeislife-unit-selector
                        .value=${this._value.unit || 'px'}
                        @change=${this._onUnitChange}>
                     </codeislife-unit-selector>
                </div>

                <div class="inputs-container ${this._isInherited ? 'inherited' : ''}">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.top ?? ''} 
                            @input=${(e: any) => this._update('top', e.target.value)}
                            type="${inputType}"
                            label="Top dimension">
                        </uui-input>
                        <label>Top</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.right ?? ''} 
                            @input=${(e: any) => this._update('right', e.target.value)}
                            type="${inputType}"
                            label="Right dimension">
                        </uui-input>
                        <label>Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottom ?? ''} 
                            @input=${(e: any) => this._update('bottom', e.target.value)}
                            type="${inputType}"
                            label="Bottom dimension">
                        </uui-input>
                        <label>Bottom</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.left ?? ''} 
                            @input=${(e: any) => this._update('left', e.target.value)}
                            type="${inputType}"
                            label="Left dimension">
                        </uui-input>
                        <label>Left</label>
                    </div>

                    <div class="link-control">
                        <uui-button 
                            compact 
                            look="${this._value.isLinked ? 'primary' : 'secondary'}" 
                            @click=${this._toggleLink}
                            label="Toggle link"
                            title="${this._value.isLinked ? 'Unlink values' : 'Link values'}">
                            <span class="link-icon">
                                ${this._value.isLinked ? '🔗' : '🔓'}
                            </span>
                        </uui-button>
                    </div>

                </div>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            font-family: inherit;
        }
        
        .size-dimension-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 400px;
        }

        .header-controls {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 24px;
            margin-bottom: 2px;
            padding-right: 2px;
        }

        .unit-selector, .unit-arrow {
            display: none;
        }

        .inputs-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto;
            gap: 4px;
            align-items: start;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        uui-input {
            width: 100%;
            text-align: center;
            --uui-input-padding-left: 2px;
            --uui-input-padding-right: 2px;
            --uui-input-height: 30px; 
            min-height: 30px;
            font-size: 12px;
        }

        .input-group label {
            font-size: 9px;
            color: #a1a1a1;
            font-weight: 500;
            margin-top: 2px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .input-group:hover label {
            opacity: 1;
            color: var(--uui-color-text);
            font-weight: 700;
        }

        .link-control {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            padding-left: 2px;
        }

        .link-icon {
            font-size: 12px;
            line-height: 1;
            opacity: 0.7;
        }
        
        uui-button[look="secondary"] .link-icon {
             filter: grayscale(100%);
             opacity: 0.5;
        }

        .inherited uui-input {
            opacity: 0.6;
            --uui-input-text-color: var(--uui-color-text-alt);
        }
    `;
}

export default CodeIsLifeSizeDimensionElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-size-dimension': CodeIsLifeSizeDimensionElement;
    }
}
