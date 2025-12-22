import { html, customElement, property, state, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

import '../../elements/unit-selector.element.js';

@customElement('size-editor')
export class SizeEditorElement extends UmbFormControlMixin<string | undefined, typeof UmbLitElement, undefined>(UmbLitElement, undefined) {

    @state()
    private _numericValue: number = 16;

    @state()
    private _unit: string = 'px';

    @state()
    private _customValue: string = "";

    @state()
    private _showToggle: boolean = false;

    @state()
    private _enabled: boolean = false;
    
    // Value stored as JSON string: "{ \"value\": \"16px\", \"enabled\": true }"
    #value: string = "";

    @property({ type: String })
    @property({ type: String })
    public override set value(value: string | undefined | unknown) {
        let newValue = value ?? "";
        
        // Handle object input (Umbraco V14+ may pass parsed JSON object)
        if (typeof newValue === 'object' && newValue !== null) {
            newValue = JSON.stringify(newValue);
        }

        const strValue = String(newValue);
        if (strValue === this.#value && this.#value !== "") return;
        
        this.#value = strValue;
        this._parseValue(this.#value);
    }
    public override get value(): string | undefined {
        return this.#value;
    }

    @property({ type: Boolean, reflect: true })
    public readonly = false;

    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        if (!config) return;

        this._min = config.getValueByAlias<number>('min') ?? 0;
        this._max = config.getValueByAlias<number>('max') ?? 100;
        this._max = config.getValueByAlias<number>('max') ?? 100;
        this._step = config.getValueByAlias<number>('step') ?? 1;
        this._showToggle = config.getValueByAlias<boolean>('showToggle') ?? false;
    }

    private _parseValue(val: unknown) {
        let stringVal = "";
        
        // Ensure input is string
        if (typeof val === 'string') {
            stringVal = val;
        } else if (typeof val === 'object' && val !== null) {
            stringVal = JSON.stringify(val);
        } else {
             stringVal = String(val ?? "");
        }

        // Self-healing: if value corrupted to "[object Object]", reset it
        if (stringVal === "[object Object]") {
            stringVal = "";
        }
        
        let valueToParse = stringVal;
        let enabled = false;

        // Try to parse as JSON first
        try {
            if (stringVal && stringVal.trim().startsWith('{')) {
                let json = JSON.parse(stringVal);
                
                // Handle potential double-serialization
                if (typeof json === 'string') {
                    try {
                         if (json.trim().startsWith('{')) {
                            json = JSON.parse(json);
                         }
                    } catch {
                        // ignore second parse error
                    }
                }

                if (typeof json === 'object' && json !== null) {
                    valueToParse = json.value ? String(json.value) : "";
                    enabled = json.enabled ?? true;
                }
            } else {
                // Not JSON, but has value -> Legacy String -> Enabled
                if (stringVal.trim().length > 0) {
                    enabled = true;
                }
            }
        } catch {
            // Fallback to treat as simple string (legacy)
            if (stringVal.trim().length > 0) {
                enabled = true;
            }
        }

        this._enabled = enabled;

        if (!valueToParse) {
            this._numericValue = 16;
            this._unit = 'px';
            this._customValue = "";
            return;
        }

        // Check if value ends with a known unit
        const units = ['px', '%', 'em', 'rem', 'vw', 'vh'];
        const foundUnit = units.find(u => valueToParse.endsWith(u));

        if (foundUnit) {
            const numPart = valueToParse.substring(0, valueToParse.length - foundUnit.length);
            const num = parseFloat(numPart);
            if (!isNaN(num)) {
                this._numericValue = num;
                this._unit = foundUnit;
                this._customValue = "";
                return;
            }
        }

        // If no unit found or strict parsing failed, treat as custom
        this._unit = 'custom';
        this._customValue = valueToParse;
    }

    private _updateValue() {
        let valStr;
        if (this._unit === 'custom') {
            valStr = this._customValue;
        } else {
            valStr = `${this._numericValue}${this._unit}`;
        }

        // Create JSON structure
        const valueObj = {
            value: valStr,
            enabled: this._enabled
        };

        const newValue = JSON.stringify(valueObj);

        if (this.#value !== newValue) {
            this.#value = newValue;
            this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
        }
    }

    private _onUnitChange(e: CustomEvent) {
        e.stopPropagation();
        const newUnit = e.detail.value;

        if (newUnit === 'custom') {
            // When switching to custom, preserve current valid value string
            if (!this._customValue) {
                this._customValue = `${this._numericValue}${this._unit}`;
            }
        } else {
            // When switching to standard, try to parse current custom value if coming from custom
            if (this._unit === 'custom' && this._customValue) {
                const num = parseFloat(this._customValue);
                if (!isNaN(num)) {
                    this._numericValue = num;
                }
            } 
            // If checking from another standard unit, _numericValue is already valid, do nothing.
        }

        this._unit = newUnit;
        this._updateValue();
    }

    private _onSliderChange(e: any) {
        this._numericValue = Number(e.target.value);
        this._updateValue();
    }

    private _onNumericInputChange(e: any) {
        e.stopPropagation();
        this._numericValue = Number(e.target.value);
        this._updateValue();
    }

    private _onCustomInputChange(e: any) {
        this._customValue = e.target.value;
        this._updateValue();
    }

    private _onToggleChange(e: any) {
        e.stopPropagation();
        this._enabled = e.target.checked;
        this._updateValue();
    }

    render() {
        return html`
            <div class="wrapper">
                <div class="header">
                    ${this._showToggle
                        ? html`<uui-toggle label="Enable/Disable" .checked=${this._enabled} @change=${this._onToggleChange} compact>Enabled</uui-toggle>`
                        : ''}
                    <codeislife-unit-selector
                        .value=${this._unit}
                        @change=${this._onUnitChange}
                        ?disabled=${!this._enabled}>
                    </codeislife-unit-selector>
                </div>
                <div class="controls">
                    ${this._unit !== 'custom'
                ? html`
                            <uui-slider
                                .min=${this._min}
                                .max=${this._max}
                                .step=${this._step}
                                .value=${this._numericValue}
                                @input=${this._onSliderChange}
                                label="Size value"
                                ?disabled=${this.readonly || !this._enabled}>
                            </uui-slider>
                            <uui-input
                                type="number"
                                .value=${this._numericValue}
                                @change=${this._onNumericInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                label="Size value"
                                style="width: 80px;">
                            </uui-input>
                        `
                : html`
                             <uui-input
                                type="text"
                                .value=${this._customValue}
                                @input=${this._onCustomInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                placeholder="Enter value (e.g. clamp(1rem, 2vw, 3rem))"
                                label="Custom size value"
                                style="width: 100%;">
                            </uui-input>
                        `
            }
                </div>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
        }
        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .header {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2px;
            gap: 5px;
            align-items: center;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            width: 100%;
            height: 30px; /* Force logical height matching inputs */
        }
        uui-slider {
            display: flex;
            flex: 1;
            padding: 0;
            align-items: center;
            --uui-slider-height: 30px; /* Hint for UUI if supported, otherwise container height rules */
        }

        uui-slider .input {
            height: initial;
        }
            
        uui-input {
            --uui-input-height: 30px;
            min-height: 30px;
        }
    `;
}

export default SizeEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'size-editor': SizeEditorElement;
    }
}
