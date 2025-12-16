import { html, customElement, property, state, css } from "@umbraco-cms/backoffice/external/lit";

import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

@customElement('advanced-dropdown-editor')
export class AdvancedDropdownEditorElement extends UmbFormControlMixin<string | undefined, typeof UmbLitElement, undefined>(UmbLitElement, undefined) {

    @state()
    private _options: Array<{ name: string, value: string, selected: boolean }> = [];

    @state()
    private _enableFiltering: boolean = false;

    #value: string = "";

    @property({ type: String })
    public override set value(value: string | undefined) {
        this.#value = value ?? "";
        this._updateSelectedState();
    }
    public override get value(): string | undefined {
        return this.#value;
    }

    @property({ type: Boolean, reflect: true })
    public readonly = false;

    @state()
    private _filteredOptions: Array<{ name: string, value: string, selected: boolean }> = [];

    private _filterTerm = "";

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        if (!config) return;

        const items = config.getValueByAlias('options');
        this._enableFiltering = config.getValueByAlias<boolean>('enableFiltering') ?? false;

        let options: Array<{ name: string, value: string }> = [];

        if (Array.isArray(items)) {
             options = items.map((item: any) => {
                 const str = typeof item === 'string' ? item : item.value;
                 const parts = str.split('|');
                 const val = parts[0].trim();
                 const lbl = parts.length > 1 ? parts[1].trim() : val;
                 return { name: lbl, value: val };
             });
        } else if (typeof items === 'string') {
            options = (items as string).split('\n').map(line => {
                const parts = line.split('|');
                const val = parts[0].trim();
                const lbl = parts.length > 1 ? parts[1].trim() : val;
                if(!val) return null;
                return { name: lbl, value: val };
            }).filter((x: any) => x !== null) as any;
        }

        this._options = options.map(opt => ({
            ...opt,
            selected: opt.value === this.#value
        }));
        this._filterOptions();

        const defaultVal = config.getValueByAlias<string>('defaultValue');
        if (!this.#value && defaultVal) {
             this.#value = defaultVal;
             this._updateSelectedState();
        }
    }

    private _updateSelectedState() {
        this._options.forEach(opt => opt.selected = opt.value === this.#value);
        this.requestUpdate();
    }

    private _filterOptions() {
        if (!this._enableFiltering || !this._filterTerm) {
            this._filteredOptions = this._options;
        } else {
            const term = this._filterTerm.toLowerCase();
            this._filteredOptions = this._options.filter(opt => 
                opt.name.toLowerCase().includes(term) || opt.value.toLowerCase().includes(term)
            );
        }
    }

    private _onInput(e: any) {
        this._filterTerm = e.target.search || "";
        this._filterOptions();
    }

    private _onChange(e: CustomEvent) {
        e.stopPropagation();
        const target = e.target as any;
        this.value = target.value as string;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
    }

    render() {
        if (this.readonly) {
            return html`<div>${this.#value}</div>`;
        }

        if (this._enableFiltering) {
             return html`
                <uui-combobox 
                    .value="${this.#value}"
                    @change="${this._onChange}"
                    @input="${this._onInput}"
                    style="width: 100%;">
                    <uui-combobox-list>
                        ${this._filteredOptions.map(opt => html`
                            <uui-combobox-list-option .value="${opt.value}" .displayValue="${opt.name}">
                                ${opt.name}
                            </uui-combobox-list-option>
                        `)}
                    </uui-combobox-list>
                </uui-combobox>
            `;
        } else {
             return html`
                <uui-select
                    .value="${this.#value}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    ${this._options.map(opt => html`
                        <uui-select-option .value="${opt.value}" .label="${opt.name}" ?selected="${opt.selected}">
                            ${opt.name}
                        </uui-select-option>
                    `)}
                </uui-select>
            `;
        }
    }
    
     static styles = css`
        :host {
            display: block;
        }
    `;
}

export default AdvancedDropdownEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'advanced-dropdown-editor': AdvancedDropdownEditorElement;
    }
}
