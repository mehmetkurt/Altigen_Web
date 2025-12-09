import { LitElement as h, html as c, css as v, property as u, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as d } from "@umbraco-cms/backoffice/element-api";
var b = Object.defineProperty, f = Object.getOwnPropertyDescriptor, r = (t, l, s, n) => {
  for (var e = n > 1 ? void 0 : n ? f(l, s) : l, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (e = (n ? o(l, s, e) : o(e)) || e);
  return n && e && b(l, s, e), e;
};
let i = class extends d(h) {
  constructor() {
    super(...arguments), this.value = [], this._options = [
      { label: "Index", value: "index" },
      { label: "No Index", value: "noindex" },
      { label: "Nofollow", value: "nofollow" },
      { label: "No Archive", value: "noarchive" },
      { label: "No Image Index", value: "noimageindex" },
      { label: "No Snippet", value: "nosnippet" }
    ];
  }
  _handleChange(t, l) {
    const n = t.target.checked;
    let e = this.value ? [...this.value] : [];
    n ? (l === "index" ? e = e.filter((a) => a !== "noindex") : l === "noindex" && (e = e.filter((a) => a !== "index")), e.includes(l) || e.push(l)) : e = e.filter((a) => a !== l), this.value = e, this.dispatchEvent(new CustomEvent("property-value-change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  render() {
    return c`
            <div class="options-container">
                ${this._options.map((t) => c`
                    <uui-checkbox 
                        .checked="${this.value?.includes(t.value) ?? !1}" 
                        @change="${(l) => this._handleChange(l, t.value)}"
                        label="${t.label}">
                        ${t.label}
                    </uui-checkbox>
                `)}
            </div>
        `;
  }
};
i.styles = v`
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;
r([
  u({ type: Array })
], i.prototype, "value", 2);
r([
  u({ attribute: !1 })
], i.prototype, "config", 2);
i = r([
  p("altigen-robots-meta")
], i);
export {
  i as default
};
//# sourceMappingURL=robots-meta.element-CoYS2u3-.js.map
