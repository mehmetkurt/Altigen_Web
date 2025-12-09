import { LitElement as d, html as a, css as f, property as r, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as x } from "@umbraco-cms/backoffice/element-api";
var m = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, c = (s, i, t, n) => {
  for (var e = n > 1 ? void 0 : n ? _(i, t) : i, l = s.length - 1, u; l >= 0; l--)
    (u = s[l]) && (e = (n ? u(i, t, e) : u(e)) || e);
  return n && e && m(i, t, e), e;
};
let o = class extends x(d) {
  constructor() {
    super(...arguments), this.value = [], this._options = [], this._exclusionRules = {}, this._inclusionRules = {};
  }
  connectedCallback() {
    super.connectedCallback(), this._initOptions(), this._initExclusionRules(), this._initInclusionRules(), this._initDefaultValue();
  }
  _initExclusionRules() {
    this.config?.exclusionRules ? this.config.exclusionRules.split(`
`).forEach((i) => {
      const t = i.split(">");
      if (t.length === 2) {
        const n = t[0].trim(), e = t[1].split(",").map((l) => l.trim());
        this._exclusionRules[n] = e;
      }
    }) : this._exclusionRules = {
      index: ["noindex"],
      noindex: ["index"]
    };
  }
  _initInclusionRules() {
    this.config?.inclusionRules && this.config.inclusionRules.split(`
`).forEach((i) => {
      const t = i.split(">");
      if (t.length === 2) {
        const n = t[0].trim(), e = t[1].split(",").map((l) => l.trim());
        this._inclusionRules[n] = e;
      }
    });
  }
  _initOptions() {
    if (this.config?.options) {
      const s = this.config.options.split(`
`);
      this._options = s.map((i) => {
        const t = i.split("|");
        return {
          label: t[0].trim(),
          value: t.length > 1 ? t[1].trim() : t[0].trim()
        };
      }).filter((i) => i.value);
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
    (!this.value || this.value.length === 0) && this.config?.defaultValues && (this.value = this.config.defaultValues.split(",").map((s) => s.trim()).filter((s) => s), this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleChange(s, i) {
    const n = s.target.checked;
    let e = this.value ? [...this.value] : [];
    if (n) {
      if (this._exclusionRules[i]) {
        const l = this._exclusionRules[i];
        e = e.filter((u) => !l.includes(u));
      }
      this._inclusionRules[i] && this._inclusionRules[i].forEach((u) => {
        if (e.includes(u) || e.push(u), this._exclusionRules[u]) {
          const h = this._exclusionRules[u];
          e = e.filter((p) => !h.includes(p));
        }
      }), e.includes(i) || e.push(i);
    } else
      e = e.filter((l) => l !== i);
    this.value = e, this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  render() {
    return a`
            <div class="options-container">
                ${this._options.map((s) => a`
                    <uui-checkbox 
                        .checked="${this.value?.includes(s.value) ?? !1}" 
                        @change="${(i) => this._handleChange(i, s.value)}"
                        label="${s.label}">
                        ${s.label}
                    </uui-checkbox>
                `)}
            </div>
        `;
  }
};
o.styles = f`
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;
c([
  r({ type: Array })
], o.prototype, "value", 2);
c([
  r({ attribute: !1 })
], o.prototype, "config", 2);
o = c([
  v("altigen-robots-meta")
], o);
export {
  o as default
};
//# sourceMappingURL=robots-meta.element-Dnul3L_c.js.map
