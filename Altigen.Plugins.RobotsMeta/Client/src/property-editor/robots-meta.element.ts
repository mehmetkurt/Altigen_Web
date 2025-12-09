import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

// DİKKAT: 'export class' yerine 'export default class' yazıyoruz.
@customElement('altigen-robots-meta')
export default class AltigenRobotsMetaElement extends UmbElementMixin(LitElement) {

    @property({ type: Array })
    public value: string[] = [];

    @property({ attribute: false })
    public config: any;

    private _options: Array<{ label: string, value: string }> = [];
    private _exclusionRules: Record<string, string[]> = {};
    private _inclusionRules: Record<string, string[]> = {};

    connectedCallback() {
        super.connectedCallback();
        this._initOptions();
        this._initExclusionRules();
        this._initInclusionRules();
        this._initDefaultValue();
    }

    private _initExclusionRules() {
        if (this.config?.exclusionRules) {
            const lines = this.config.exclusionRules.split('\n');
            lines.forEach((line: string) => {
                const parts = line.split('>');
                if (parts.length === 2) {
                    const trigger = parts[0].trim();
                    const excluded = parts[1].split(',').map(s => s.trim());
                    this._exclusionRules[trigger] = excluded;
                }
            });
        } else {
            // Default rules if not configured
            this._exclusionRules = {
                "index": ["noindex"],
                "noindex": ["index"]
            };
        }
    }

    private _initInclusionRules() {
        if (this.config?.inclusionRules) {
            const lines = this.config.inclusionRules.split('\n');
            lines.forEach((line: string) => {
                const parts = line.split('>');
                if (parts.length === 2) {
                    const trigger = parts[0].trim();
                    const included = parts[1].split(',').map(s => s.trim());
                    this._inclusionRules[trigger] = included;
                }
            });
        }
    }

    private _initOptions() {
        if (this.config?.options) {
            const lines = this.config.options.split('\n');
            this._options = lines.map((line: string) => {
                const parts = line.split('|');
                return {
                    label: parts[0].trim(),
                    value: parts.length > 1 ? parts[1].trim() : parts[0].trim()
                };
            }).filter((opt: { label: string, value: string }) => opt.value);
        } else {
            // Default options if not configured
            this._options = [
                { label: "Index", value: "index" },
                { label: "No Index", value: "noindex" },
                { label: "Nofollow", value: "nofollow" },
                { label: "No Archive", value: "noarchive" },
                { label: "No Image Index", value: "noimageindex" },
                { label: "No Snippet", value: "nosnippet" }
            ];
        }
    }

    private _initDefaultValue() {
        if ((!this.value || this.value.length === 0) && this.config?.defaultValues) {
            this.value = this.config.defaultValues.split(',').map((v: string) => v.trim()).filter((v: string) => v);
            this.dispatchEvent(new CustomEvent('property-value-change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
            }));
        }
    }

    private _handleChange(e: Event, optionValue: string) {
        const checkbox = e.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        let newValue = this.value ? [...this.value] : [];

        if (isChecked) {
            // Apply exclusion rules
            if (this._exclusionRules[optionValue]) {
                const excludedValues = this._exclusionRules[optionValue];
                newValue = newValue.filter(v => !excludedValues.includes(v));
            }

            // Apply inclusion rules
            if (this._inclusionRules[optionValue]) {
                const includedValues = this._inclusionRules[optionValue];
                includedValues.forEach(val => {
                    if (!newValue.includes(val)) {
                        newValue.push(val);
                    }
                    // Also apply exclusions for the included values (recursive-like but just one level for now)
                    if (this._exclusionRules[val]) {
                         const recursiveExcluded = this._exclusionRules[val];
                         newValue = newValue.filter(v => !recursiveExcluded.includes(v));
                    }
                });
            }

            if (!newValue.includes(optionValue)) {
                newValue.push(optionValue);
            }
        } else {
            newValue = newValue.filter(v => v !== optionValue);
        }

        this.value = newValue;

        this.dispatchEvent(new CustomEvent('property-value-change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
        }));

        this.requestUpdate();
    }

    render() {
        return html`
            <div class="options-container">
                ${this._options.map(opt => html`
                    <uui-checkbox 
                        .checked="${this.value?.includes(opt.value) ?? false}" 
                        @change="${(e: Event) => this._handleChange(e, opt.value)}"
                        label="${opt.label}">
                        ${opt.label}
                    </uui-checkbox>
                `)}
            </div>
        `;
    }

    static styles = css`
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'altigen-robots-meta': AltigenRobotsMetaElement;
    }
}