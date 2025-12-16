import { LitElement, css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement('codeislife-unit-selector')
export class CodeIsLifeUnitSelectorElement extends UmbElementMixin(LitElement) {

    @property({ type: String })
    public value: string = 'px';

    @property({ type: Array })
    public units: string[] = ['px', '%', 'em', 'rem', 'vw', 'vh', 'custom'];

    private _selectUnit(unit: string) {
        this.value = unit;
        this.dispatchEvent(new CustomEvent('change', { 
            detail: { value: unit },
            bubbles: true, 
            composed: true 
        }));
    }

    render() {
        return html`
            <div class="unit-group">
                ${this.units.map(unit => html`
                    <button 
                        type="button"
                        class="unit-btn ${this.value === unit ? 'selected' : ''}"
                        @click=${() => this._selectUnit(unit)}
                        title="${unit === 'custom' ? 'Custom' : unit}">
                        ${unit === 'custom' 
                            ? html`<uui-icon name="icon-edit" style="font-size: 12px;"></uui-icon>` 
                            : unit}
                    </button>
                `)}
            </div>
        `;
    }

    static styles = css`
        :host {
            display: inline-block;
        }

        .unit-group {
            display: flex;
            background: var(--uui-color-surface-alt);
            border-radius: 4px;
            padding: 2px;
            gap: 2px;
        }

        .unit-btn {
            background: transparent;
            border: none;
            border-radius: 3px;
            font-family: inherit;
            font-size: 10px;
            font-weight: 500;
            color: var(--uui-color-text-alt);
            cursor: pointer;
            padding: 4px 6px;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .unit-btn:hover {
            color: var(--uui-color-text);
            background: var(--uui-color-surface-emphasis);
            opacity: 0.7;
        }

        .unit-btn.selected {
            background: var(--uui-color-selected);
            color: var(--uui-color-selected-contrast);
            font-weight: 700;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
    `;
}

export default CodeIsLifeUnitSelectorElement;

declare global {
    interface HTMLElementTagNameMap {
        'codeislife-unit-selector': CodeIsLifeUnitSelectorElement;
    }
}
