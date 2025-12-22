import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import '../../elements/unit-selector.element.js';

interface BorderRadiusValue {
    topLeft?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
    unit?: string;
    isLinked?: boolean;
}

@customElement('codeislife-border-radius')
export class CodeIsLifeBorderRadiusElement extends UmbElementMixin(LitElement) {

    @state()
    private _value: BorderRadiusValue = { unit: 'px', isLinked: true };

    @property({ attribute: false })
    public config: any;

    @property({ attribute: false })
    public set value(value: string | BorderRadiusValue | undefined) {
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

    public get value(): BorderRadiusValue {
        return this._value;
    }

    private _update(corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', val: string) {
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
            // Update all corners if linked
            this._value = { 
                ...this._value, 
                topLeft: cleanVal, 
                topRight: cleanVal, 
                bottomRight: cleanVal, 
                bottomLeft: cleanVal 
            };
        } else {
            // Update only specific corner
            this._value = { ...this._value, [corner]: cleanVal };
        }
        this._dispatchChange();
        this.requestUpdate(); 
    }

    private _toggleLink() {
        this._value = { ...this._value, isLinked: !this._value.isLinked };
        
        // If we just linked, sync all values to the top-left value (or first available)
        if (this._value.isLinked) {
            const syncVal = this._value.topLeft || this._value.topRight || this._value.bottomRight || this._value.bottomLeft || "";
            this._value = {
                ...this._value,
                topLeft: syncVal,
                topRight: syncVal,
                bottomRight: syncVal,
                bottomLeft: syncVal
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
            <div class="border-radius-wrapper">
                
                <div class="header-controls">
                    <codeislife-unit-selector
                        .value=${this._value.unit || 'px'}
                        @change=${(e: CustomEvent) => {
                            e.stopPropagation();
                            this._value = { ...this._value, unit: e.detail.value };
                            this._dispatchChange();
                        }}>
                     </codeislife-unit-selector>
                </div>

                <div class="inputs-container">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.topLeft ?? ''} 
                            @input=${(e: any) => this._update('topLeft', e.target.value)}
                            type="${inputType}"
                            label="Top-Left radius">
                        </uui-input>
                        <label>Top-Left</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.topRight ?? ''} 
                            @input=${(e: any) => this._update('topRight', e.target.value)}
                            type="${inputType}"
                            label="Top-Right radius">
                        </uui-input>
                        <label>Top-Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottomRight ?? ''} 
                            @input=${(e: any) => this._update('bottomRight', e.target.value)}
                            type="${inputType}"
                            label="Bottom-Right radius">
                        </uui-input>
                        <label>Btm-Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottomLeft ?? ''} 
                            @input=${(e: any) => this._update('bottomLeft', e.target.value)}
                            type="${inputType}"
                            label="Bottom-Left radius">
                        </uui-input>
                        <label>Btm-Left</label>
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
        
        .border-radius-wrapper {
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
            white-space: nowrap;
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

export default CodeIsLifeBorderRadiusElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-border-radius': CodeIsLifeBorderRadiusElement;
    }
}
