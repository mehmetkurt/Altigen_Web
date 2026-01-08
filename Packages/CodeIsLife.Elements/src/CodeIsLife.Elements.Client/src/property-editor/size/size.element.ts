import { html, customElement, property, state, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

import '../../elements/unit-selector.element.js';

import { UmbResponsiveMixin } from '../../mixins/responsive.mixin.js';

interface SizeValue {
    value: string;
    enabled: boolean;
}

@customElement('size-editor')
export class SizeEditorElement extends UmbFormControlMixin<string | undefined, typeof UmbLitElement, undefined>(UmbResponsiveMixin<SizeValue>(UmbLitElement) as unknown as typeof UmbLitElement, undefined) {
    
    // Mixin method declarations to satisfy TS
    // Mixin method declarations to satisfy TS
    public renderDeviceSelector!: () => any;
    public getCurrentDeviceValue!: () => SizeValue | undefined;
    public getResolvedDeviceValue!: () => { value: SizeValue | undefined, inherited: boolean, source: string };
    public setDeviceValue!: (val: SizeValue) => void;

    @state()
    private _isInherited: boolean = false;

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
        this._step = config.getValueByAlias<number>('step') ?? 1;
        this._showToggle = config.getValueByAlias<boolean>('showToggle') ?? false;
    }

    // Override update to react to device changes from Mixin
    protected override updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('_currentDevice') || changedProperties.has('_responsiveData')) {
            this._loadCurrentState();
        }
    }

    private _loadCurrentState() {
        const resolution = this.getResolvedDeviceValue();
        console.log('[SizeEditor] Loading State:', resolution);
        this._isInherited = resolution.inherited;
        const data = resolution.value;
        
        if (!data) {
            // Default empty state for this device
            console.warn('[SizeEditor] No data found. Disabling UI.');
            this._numericValue = 16;
            this._unit = 'px';
            this._customValue = "";
            this._enabled = false;
        } else {
            console.log('[SizeEditor] Data found. Enabled:', data.enabled);
            this._enabled = data.enabled;
            this._parseSingleValue(data.value);
        }
    }

    private _parseSingleValue(valStr: string) {
        if (!valStr) {
            this._numericValue = 0;
            this._unit = 'px';
            this._customValue = "";
            return;
        }

        // Check if value ends with a known unit
        const units = ['px', '%', 'em', 'rem', 'vw', 'vh'];
        const foundUnit = units.find(u => valStr.endsWith(u));

        if (foundUnit) {
            const numPart = valStr.substring(0, valStr.length - foundUnit.length);
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
        this._customValue = valStr;
    }

    private _saveCurrentState() {
        let valStr;
        if (this._unit === 'custom') {
            valStr = this._customValue;
        } else {
            valStr = `${this._numericValue}${this._unit}`;
        }

        const currentVal: SizeValue = {
            value: valStr,
            enabled: this._enabled
        };
        console.log('[SizeEditor] Saving State:', currentVal);

        this.setDeviceValue(currentVal);
    }

    private _onUnitChange(e: CustomEvent) {
        e.stopPropagation();
        const newUnit = e.detail.value;

        if (newUnit === 'custom') {
            if (!this._customValue) {
                this._customValue = `${this._numericValue}${this._unit}`;
            }
        } else {
            if (this._unit === 'custom' && this._customValue) {
                const num = parseFloat(this._customValue);
                if (!isNaN(num)) {
                    this._numericValue = num;
                }
            } 
        }

        this._unit = newUnit;
        this._saveCurrentState();
    }

    private _onSliderChange(e: any) {
        this._numericValue = Number(e.target.value);
        this._saveCurrentState();
    }

    private _onNumericInputChange(e: any) {
        e.stopPropagation();
        this._numericValue = Number(e.target.value);
        this._saveCurrentState();
    }

    private _onCustomInputChange(e: any) {
        this._customValue = e.target.value;
        this._saveCurrentState();
    }

    private _onToggleChange(e: any) {
        e.stopPropagation();
        this._enabled = e.target.checked;
        this._saveCurrentState();
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
                <div class="controls ${this._isInherited ? 'inherited' : ''}">
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

        .inherited uui-input,
        .inherited uui-slider {
            opacity: 0.6;
            --uui-input-text-color: var(--uui-color-text-alt);
        }
    `;
}

export default SizeEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'size-editor': SizeEditorElement;
    }
}
