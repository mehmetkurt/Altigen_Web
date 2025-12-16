import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import '../../elements/unit-selector.element.js';

interface SpacingValue {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    unit?: string;
    isLinked?: boolean;
}

@customElement('codeislife-spacing-editor')
export class CodeIsLifeSpacingEditorElement extends UmbElementMixin(LitElement) {

    @state()
    private _value: SpacingValue = { unit: 'px', isLinked: true };

    @property({ attribute: false })
    public config: any;

    @property({ attribute: false })
    public set value(value: string | SpacingValue | undefined) {
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

    public get value(): SpacingValue {
        return this._value;
    }

    private _update(side: 'top' | 'right' | 'bottom' | 'left', val: string) {
        let cleanVal = val;

        // If not custom, only allow numeric values
        if (this._value.unit !== 'custom') {
            // Remove any non-numeric characters except dot, comma and minus
            // Also handle multiple dots/commas if necessary, but simple regex is usually enough for basic cleaning
            // However, since we use type="number", the browser might already handle some invalid inputs,
            // but we double check here to be safe and to prevent "22px" from being pasted.
            
            // Allow numbers, decimal points, and negative sign at start
            const numericRegex = /^-?[0-9]*[.,]?[0-9]*$/;
            
            if (!numericRegex.test(val) && val !== '') {
                 // specific logic to strip invalid chars if the user forces them in
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
            <div class="spacing-wrapper">
                
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
        
        .spacing-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 400px;
        }

        .header-controls {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 24px; /* Increased height */
            margin-bottom: 2px;
            padding-right: 2px;
        }

        .unit-selector, .unit-arrow {
            display: none;
        }

        .inputs-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto; /* 4 inputs + link button */
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
            min-height: 30px; /* User requested min-height */
            font-size: 12px;
        }

        .input-group label {
            font-size: 9px;
            color: #a1a1a1; /* Fixed soft gray */
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
            height: 30px; /* Match input height */
            padding-left: 2px;
        }

        .link-icon {
            font-size: 12px; /* Smaller icon too */
            line-height: 1;
            opacity: 0.7;
        }
        
        uui-button[look="secondary"] .link-icon {
             filter: grayscale(100%);
             opacity: 0.5;
        }
    `;
}

export default CodeIsLifeSpacingEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-spacing-editor': CodeIsLifeSpacingEditorElement;
    }
}
