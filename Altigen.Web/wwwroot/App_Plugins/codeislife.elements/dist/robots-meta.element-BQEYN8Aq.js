import { LitElement as d, html as a, css as f, property as r, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as x } from "@umbraco-cms/backoffice/element-api";
var m = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, c = (s, e, l, t) => {
  for (var i = t > 1 ? void 0 : t ? _(e, l) : e, u = s.length - 1, n; u >= 0; u--)
    (n = s[u]) && (i = (t ? n(e, l, i) : n(i)) || i);
  return t && i && m(e, l, i), i;
};
let o = class extends x(d) {
  constructor() {
    super(...arguments), this.value = [], this._options = [], this._exclusionRules = {}, this._inclusionRules = {};
  }
  connectedCallback() {
    super.connectedCallback(), this._initOptions(), this._initExclusionRules(), this._initInclusionRules(), this._initDefaultValue();
  }
  _initExclusionRules() {
    var s;
    (s = this.config) != null && s.exclusionRules ? this.config.exclusionRules.split(`
`).forEach((l) => {
      const t = l.split(">");
      if (t.length === 2) {
        const i = t[0].trim(), u = t[1].split(",").map((n) => n.trim());
        this._exclusionRules[i] = u;
      }
    }) : this._exclusionRules = {
      index: ["noindex"],
      noindex: ["index"]
    };
  }
  _initInclusionRules() {
    var s;
    (s = this.config) != null && s.inclusionRules && this.config.inclusionRules.split(`
`).forEach((l) => {
      const t = l.split(">");
      if (t.length === 2) {
        const i = t[0].trim(), u = t[1].split(",").map((n) => n.trim());
        this._inclusionRules[i] = u;
      }
    });
  }
  _initOptions() {
    var s;
    if ((s = this.config) != null && s.options) {
      const e = this.config.options.split(`
`);
      this._options = e.map((l) => {
        const t = l.split("|");
        return {
          label: t[0].trim(),
          value: t.length > 1 ? t[1].trim() : t[0].trim()
        };
      }).filter((l) => l.value);
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
    var s;
    (!this.value || this.value.length === 0) && ((s = this.config) != null && s.defaultValues) && (this.value = this.config.defaultValues.split(",").map((e) => e.trim()).filter((e) => e), this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleChange(s, e) {
    const t = s.target.checked;
    let i = this.value ? [...this.value] : [];
    if (t) {
      if (this._exclusionRules[e]) {
        const u = this._exclusionRules[e];
        i = i.filter((n) => !u.includes(n));
      }
      this._inclusionRules[e] && this._inclusionRules[e].forEach((n) => {
        if (i.includes(n) || i.push(n), this._exclusionRules[n]) {
          const h = this._exclusionRules[n];
          i = i.filter((p) => !h.includes(p));
        }
      }), i.includes(e) || i.push(e);
    } else
      i = i.filter((u) => u !== e);
    this.value = i, this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  render() {
    return a`
            <div class="options-container">
                ${this._options.map((s) => {
      var e;
      return a`
                    <uui-checkbox 
                        .checked="${((e = this.value) == null ? void 0 : e.includes(s.value)) ?? !1}" 
                        @change="${(l) => this._handleChange(l, s.value)}"
                        label="${s.label}">
                        ${s.label}
                    </uui-checkbox>
                `;
    })}
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
