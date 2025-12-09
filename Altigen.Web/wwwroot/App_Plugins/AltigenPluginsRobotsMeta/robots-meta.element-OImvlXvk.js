import { LitElement as h, html as u, css as p, property as c, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as f } from "@umbraco-cms/backoffice/element-api";
var d = Object.defineProperty, b = Object.getOwnPropertyDescriptor, r = (l, t, i, n) => {
  for (var e = n > 1 ? void 0 : n ? b(t, i) : t, s = l.length - 1, o; s >= 0; s--)
    (o = l[s]) && (e = (n ? o(t, i, e) : o(e)) || e);
  return n && e && d(t, i, e), e;
};
let a = class extends f(h) {
  constructor() {
    super(...arguments), this.value = [], this._options = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._initOptions(), this._initDefaultValue();
  }
  _initOptions() {
    if (this.config?.options) {
      const l = this.config.options.split(`
`);
      this._options = l.map((t) => {
        const i = t.split("|");
        return {
          label: i[0].trim(),
          value: i.length > 1 ? i[1].trim() : i[0].trim()
        };
      }).filter((t) => t.value);
    } else
      this._options = [
        { label: "Index", value: "index" },
        { label: "No Index", value: "noindex" },
        { label: "Nofollow", value: "nofollow" },
        { label: "No Archive", value: "noarchive" },
        { label: "No Image Index", value: "noimageindex" },
        { label: "No Snippet", value: "nosnippet" }
      ];
  }
  _initDefaultValue() {
    (!this.value || this.value.length === 0) && this.config?.defaultValues && (this.value = this.config.defaultValues.split(",").map((l) => l.trim()).filter((l) => l), this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleChange(l, t) {
    const n = l.target.checked;
    let e = this.value ? [...this.value] : [];
    n ? (t === "index" ? e = e.filter((s) => s !== "noindex") : t === "noindex" && (e = e.filter((s) => s !== "index")), e.includes(t) || e.push(t)) : e = e.filter((s) => s !== t), this.value = e, this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  render() {
    return u`
            <div class="options-container">
                ${this._options.map((l) => u`
                    <uui-checkbox 
                        .checked="${this.value?.includes(l.value) ?? !1}" 
                        @change="${(t) => this._handleChange(t, l.value)}"
                        label="${l.label}">
                        ${l.label}
                    </uui-checkbox>
                `)}
            </div>
        `;
  }
};
a.styles = p`
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;
r([
  c({ type: Array })
], a.prototype, "value", 2);
r([
  c({ attribute: !1 })
], a.prototype, "config", 2);
a = r([
  v("altigen-robots-meta")
], a);
export {
  a as default
};
//# sourceMappingURL=robots-meta.element-OImvlXvk.js.map
