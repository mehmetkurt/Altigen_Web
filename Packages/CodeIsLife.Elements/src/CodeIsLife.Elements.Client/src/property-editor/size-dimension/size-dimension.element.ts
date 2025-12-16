import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import '../../elements/unit-selector.element.js';

interface SizeDimensionValue {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    unit?: string;
    isLinked?: boolean;
}

@customElement('codeislife-size-dimension')
export class CodeIsLifeSizeDimensionElement extends UmbElementMixin(LitElement) {

    @state()
    private _value: SizeDimensionValue = { unit: 'px', isLinked: true };

    @property({ attribute: false })
    public config: any;

    @property({ attribute: false })
    public set value(value: string | SizeDimensionValue | undefined) {
        if (!value) {
            this._value = { unit: 'px', isLinked: true };
            return;
        }

        if (typeof value === 'object') {
            this._value = { unit: 'px', isLinked: true, ...value };
            return;
        }
        
        try {
            const parsed = JSON.parse(value);
            this._value = { 
                unit: 'px', 
                isLinked: true,
                ...parsed 
            };
        } catch {
            this._value = { unit: 'px', isLinked: true };
        }
    }

    public get value(): SizeDimensionValue {
        return this._value;
    }

    private _update(side: 'top' | 'right' | 'bottom' | 'left', val: string) {
        let cleanVal = val;

        // If not custom, only allow numeric values
        if (this._value.unit !== 'custom') {
            // Remove any non-numeric characters except dot, comma and minus
            const numericRegex = /^-?[0-9]*[.,]?[0-9]*$/;
            
            if (!numericRegex.test(val) && val !== '') {
                 cleanVal = val.replace(/[^0-9.,-]/g, '');
            }
        }

        if (this._value.isLinked) {
            // Update all sides if linked
            this._value = { 
                ...this._value, 
                top: cleanVal, 
                right: cleanVal, 
                bottom: cleanVal, 
                left: cleanVal 
            };
        } else {
            // Update only specific side
            this._value = { ...this._value, [side]: cleanVal };
        }
        this._dispatchChange();
        this.requestUpdate(); 
    }

    private _toggleLink() {
        this._value = { ...this._value, isLinked: !this._value.isLinked };
        
        // If we just linked, sync all values to the top value (or first available)
        if (this._value.isLinked) {
            const syncVal = this._value.top || this._value.right || this._value.bottom || this._value.left || "";
            this._value = {
                ...this._value,
                top: syncVal,
                right: syncVal,
                bottom: syncVal,
                left: syncVal
            };
            this._dispatchChange();
        } else {
            // Just trigger re-render to update icon state
            this.requestUpdate();
        }
    }

    private _dispatchChange() {
        this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
    }

    render() {
        const inputType = this._value.unit === 'custom' ? 'text' : 'number';

        return html`
            <div class="size-dimension-wrapper">
                
                <div class="header-controls">
                    <codeislife-unit-selector
                        .value=${this._value.unit || 'px'}
                        @change=${(e: CustomEvent) => {
                            this._value = { ...this._value, unit: e.detail.value };
                            this._dispatchChange();
                        }}>
                     </codeislife-unit-selector>
                </div>

                <div class="inputs-container">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.top ?? ''} 
                            @input=${(e: any) => this._update('top', e.target.value)}
                            type="${inputType}">
                        </uui-input>
                        <label>Top</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.right ?? ''} 
                            @input=${(e: any) => this._update('right', e.target.value)}
                            type="${inputType}">
                        </uui-input>
                        <label>Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottom ?? ''} 
                            @input=${(e: any) => this._update('bottom', e.target.value)}
                            type="${inputType}">
                        </uui-input>
                        <label>Bottom</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.left ?? ''} 
                            @input=${(e: any) => this._update('left', e.target.value)}
                            type="${inputType}">
                        </uui-input>
                        <label>Left</label>
                    </div>

                    <div class="link-control">
                        <uui-button 
                            compact 
                            look="${this._value.isLinked ? 'primary' : 'secondary'}" 
                            @click=${this._toggleLink}
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
    `;
}

export default CodeIsLifeSizeDimensionElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-size-dimension': CodeIsLifeSizeDimensionElement;
    }
}
