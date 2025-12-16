import { LitElement, css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

interface TextAlignmentValue {
    value: string;
    type: string;
}

@customElement('codeislife-text-alignment')
export class CodeIsLifeTextAlignmentElement extends UmbElementMixin(LitElement) {

    @state()
    private _value: TextAlignmentValue = { value: 'left', type: 'Default (Inline Style)' };

    @property({ attribute: false })
    public set config(value: any) {
        if (Array.isArray(value)) {
            // Normalize array config to object
            this._config = value.reduce((acc, item) => {
                acc[item.alias] = item.value;
                return acc;
            }, {});
        } else {
            this._config = value;
        }
    }

    public get config(): any {
        return this._config;
    }

    @state()
    private _config: any;

    @state()
    private _displayValue: string = '';

    @property({ attribute: false })
    public set value(value: string | TextAlignmentValue | undefined) {
        if (!value) {
            this._value = { value: 'left', type: 'Default (Inline Style)' };
            return;
        }

        if (typeof value === 'object') {
            const val = value as Partial<TextAlignmentValue>;
            this._value = { 
                value: val.value ?? 'left', 
                type: val.type ?? 'Default (Inline Style)' 
            };
            return;
        }

        try {
            const parsed = JSON.parse(value);
            // Check if it's our object structure
            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
                this._value = parsed;
            } else {
                // Legacy or simple string passed as JSON (unlikely but possible)
                this._value = { value: value as string, type: 'Default (Inline Style)' };
            }
        } catch {
            // It's a simple string (legacy)
            this._value = { value: value as string, type: 'Default (Inline Style)' };
        }
    }

    public get value(): TextAlignmentValue {
        return this._value;
    }

    private _shouldDispatchChange = false;

    override connectedCallback() {
        super.connectedCallback();
        this._updateDisplayValue();
    }

    override updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (this._shouldDispatchChange) {
            this._shouldDispatchChange = false;
            // Notify parent that value usage has been corrected/customized
            this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
        }
    }

    override willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('value') || changedProperties.has('config')) {
            this._syncTypeWithConfig();
            this._updateDisplayValue();
        }
    }

    private _syncTypeWithConfig() {
        if (!this.config) return;

        let outputType = this.config.outputType ?? 'Default (Inline Style)';

        if (Array.isArray(outputType)) {
            outputType = outputType[0];
        }

        // If current type doesn't match config, update it.
        if (this._value.type !== outputType) {
            let newValue = this._value.value;

            // If switching TO Css Class, and we have a simple legacy value like 'left', 
            // we should try to remap it to the configured class name.
            if (outputType === 'Css Class' || (Array.isArray(outputType) && outputType[0] === 'Css Class')) {
                 const mapping: Record<string, string> = {
                    left: this.config?.leftValue ?? 'left',
                    center: this.config?.centerValue ?? 'center',
                    right: this.config?.rightValue ?? 'right',
                    justify: this.config?.justifyValue ?? 'justify',
                };
                
                // Reverse check: if the *current* value is a key (left/center/right), map it.
                // If it's already a class, leave it (or if it's unknown).
                if (newValue === 'left') newValue = mapping.left;
                else if (newValue === 'center') newValue = mapping.center;
                else if (newValue === 'right') newValue = mapping.right;
                else if (newValue === 'justify') newValue = mapping.justify;
            }

            this._value = { 
                value: newValue, 
                type: outputType 
            };
            
            // Mark for dispatch in updated()
            this._shouldDispatchChange = true;
        }
    }

    private _updateDisplayValue() {
        // Use the inner value for display logic
        const currentValue = this._value.value;
        const leftValue = this.config?.leftValue ?? 'left';
        const centerValue = this.config?.centerValue ?? 'center';
        const rightValue = this.config?.rightValue ?? 'right';
        const justifyValue = this.config?.justifyValue ?? 'justify';

        if (currentValue === leftValue) this._displayValue = leftValue;
        else if (currentValue === centerValue) this._displayValue = centerValue;
        else if (currentValue === rightValue) this._displayValue = rightValue;
        else if (currentValue === justifyValue) this._displayValue = justifyValue;
        else this._displayValue = currentValue; // Fallback
    }

    private _setValue(alignment: 'left' | 'center' | 'right' | 'justify') {
        const mapping: Record<string, string> = {
            left: this.config?.leftValue ?? 'left',
            center: this.config?.centerValue ?? 'center',
            right: this.config?.rightValue ?? 'right',
            justify: this.config?.justifyValue ?? 'justify',
        };

        let outputType = this.config?.outputType ?? 'Default (Inline Style)';
        if (Array.isArray(outputType)) {
            outputType = outputType[0];
        }
        
        this._value = { 
            value: mapping[alignment],
            type: outputType
        };
        
        this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
        this.requestUpdate();
    }

    render() {
        // Resolve current effective values to check selected state
        const leftValue = this.config?.leftValue ?? 'left';
        const centerValue = this.config?.centerValue ?? 'center';
        const rightValue = this.config?.rightValue ?? 'right';
        const justifyValue = this.config?.justifyValue ?? 'justify';
        
        const currentValue = this._value.value;

        return html`
            <div class="wrapper">
                <div class="button-group">
                    <button
                        type="button"
                        class="btn ${currentValue === leftValue ? 'selected' : ''}"
                        @click=${() => this._setValue('left')}
                        title="Align Left">
                        <uui-icon name="icon-text-align-left"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${currentValue === centerValue ? 'selected' : ''}"
                        @click=${() => this._setValue('center')}
                        title="Align Center">
                        <uui-icon name="icon-text-align-center"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${currentValue === rightValue ? 'selected' : ''}"
                        @click=${() => this._setValue('right')}
                        title="Align Right">
                        <uui-icon name="icon-text-align-right"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${currentValue === justifyValue ? 'selected' : ''}"
                        @click=${() => this._setValue('justify')}
                        title="Justify">
                        <uui-icon name="icon-text-align-justify"></uui-icon>
                    </button>
                </div>
                <span class="value-label">${this._displayValue}</span>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
        }

        .wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .button-group {
            display: inline-flex;
            background: var(--uui-color-surface-alt);
            border-radius: var(--uui-border-radius);
            padding: 2px;
            gap: 2px;
        }

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: var(--uui-border-radius);
            cursor: pointer;
            padding: 6px 10px;
            color: var(--uui-color-text-alt);
            transition: all 0.2s ease;
        }

        .btn:hover {
            background: var(--uui-color-surface-emphasis);
            color: var(--uui-color-text);
        }

        .btn.selected {
            background: var(--uui-color-selected);
            color: var(--uui-color-selected-contrast);
        }

        uui-icon {
            font-size: 16px;
            display: block;
        }

        .value-label {
            font-size: 0.9rem;
            color: var(--uui-color-text);
            opacity: 0.8;
        }
    `;
}

export default CodeIsLifeTextAlignmentElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-text-alignment': CodeIsLifeTextAlignmentElement;
    }
}
