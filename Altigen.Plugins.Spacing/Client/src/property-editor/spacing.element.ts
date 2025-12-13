import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

interface SpacingValue {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    unit?: string;
    isLinked?: boolean;
}

@customElement('altigen-spacing-editor')
export class AltigenSpacingEditorElement extends UmbElementMixin(LitElement) {

    @state()
    private _value: SpacingValue = { unit: 'px', isLinked: true };

    @property({ attribute: false })
    public config: any;

    @property({ type: String })
    public set value(value: string | undefined) {
        if (!value) {
            this._value = { unit: 'px', isLinked: true };
            return;
        }
        try {
            const parsed = JSON.parse(value);
            // Ensure defaults
            this._value = { 
                unit: 'px', 
                isLinked: true,
                ...parsed 
            };
        } catch {
            this._value = { unit: 'px', isLinked: true };
        }
    }

    public get value(): string {
        return JSON.stringify(this._value);
    }

    private _update(side: 'top' | 'right' | 'bottom' | 'left', val: string) {
        if (this._value.isLinked) {
            // Update all sides if linked
            this._value = { 
                ...this._value, 
                top: val, 
                right: val, 
                bottom: val, 
                left: val 
            };
        } else {
            // Update only specific side
            this._value = { ...this._value, [side]: val };
        }
        this._dispatchChange();
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

    private _changeUnit(e: Event) {
        const target = e.target as HTMLSelectElement;
        this._value = { ...this._value, unit: target.value };
        this._dispatchChange();
    }

    private _dispatchChange() {
        this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <div class="spacing-wrapper">
                
                <div class="header-controls">
                     <div class="unit-selector">
                        <select @change=${this._changeUnit} .value=${this._value.unit || 'px'}>
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="em">em</option>
                            <option value="rem">rem</option>
                            <option value="vw">vw</option>
                            <option value="vh">vh</option>
                            <option value="">custom</option>
                        </select>
                        <span class="unit-arrow">▼</span>
                     </div>
                </div>

                <div class="inputs-container">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.top ?? ''} 
                            @input=${(e: any) => this._update('top', e.target.value)}
                            type="text">
                        </uui-input>
                        <label>Top</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.right ?? ''} 
                            @input=${(e: any) => this._update('right', e.target.value)}
                            type="text">
                        </uui-input>
                        <label>Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottom ?? ''} 
                            @input=${(e: any) => this._update('bottom', e.target.value)}
                            type="text">
                        </uui-input>
                        <label>Bottom</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.left ?? ''} 
                            @input=${(e: any) => this._update('left', e.target.value)}
                            type="text">
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

        .unit-selector {
            position: relative;
            display: inline-flex;
            align-items: center;
            background: var(--uui-color-surface-alt);
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 0 4px;
            height: 20px;
            transition: all 0.2s;
        }
        
        .unit-selector:hover {
            border-color: var(--uui-color-border-emphasis);
            background: var(--uui-color-surface);
        }

        .unit-selector select {
            appearance: none;
            -webkit-appearance: none;
            background: transparent;
            border: none;
            color: var(--uui-color-text);
            font-size: 10px;
            text-transform: lowercase;
            font-weight: 600;
            cursor: pointer;
            padding-right: 14px; /* Space for arrow */
            height: 100%;
            line-height: 1;
        }
        
        .unit-selector select:hover, .unit-selector select:focus {
            outline: none;
        }

        .unit-arrow {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 7px;
            color: var(--uui-color-text-alt);
            pointer-events: none;
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

export default AltigenSpacingEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'altigen-spacing-editor': AltigenSpacingEditorElement;
    }
}
