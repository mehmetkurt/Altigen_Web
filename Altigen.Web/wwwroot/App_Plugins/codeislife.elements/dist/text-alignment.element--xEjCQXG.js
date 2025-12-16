import { LitElement as c, html as p, css as d, property as a, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
var v = Object.defineProperty, f = Object.getOwnPropertyDescriptor, s = (n, r, o, i) => {
  for (var e = i > 1 ? void 0 : i ? f(r, o) : r, u = n.length - 1, l; u >= 0; u--)
    (l = n[u]) && (e = (i ? l(r, o, e) : l(e)) || e);
  return i && e && v(r, o, e), e;
};
let t = class extends g(c) {
  constructor() {
    super(...arguments), this.value = "left";
  }
  _setValue(n) {
    this.value = n, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return p`
            <div class="button-group">
                <button
                    type="button"
                    class="btn ${this.value === "left" ? "selected" : ""}"
                    @click=${() => this._setValue("left")}
                    title="Align Left">
                    <uui-icon name="icon-align-left"></uui-icon>
                </button>
                <button
                    type="button"
                    class="btn ${this.value === "center" ? "selected" : ""}"
                    @click=${() => this._setValue("center")}
                    title="Align Center">
                    <uui-icon name="icon-align-center"></uui-icon>
                </button>
                <button
                    type="button"
                    class="btn ${this.value === "right" ? "selected" : ""}"
                    @click=${() => this._setValue("right")}
                    title="Align Right">
                    <uui-icon name="icon-align-right"></uui-icon>
                </button>
            </div>
        `;
  }
};
t.styles = d`
        :host {
            display: block;
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
            display: block; // Ensure no extra space
        }
    `;
s([
  a({ type: String })
], t.prototype, "value", 2);
s([
  a({ attribute: !1 })
], t.prototype, "config", 2);
t = s([
  b("codeislife-text-alignment")
], t);
const x = t;
export {
  t as CodeIsLifeTextAlignmentElement,
  x as default
};
