import { LitElement as o, html as v, css as c, state as d, property as n, customElement as h } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
var _ = Object.defineProperty, m = Object.getOwnPropertyDescriptor, l = (t, i, p, a) => {
  for (var e = a > 1 ? void 0 : a ? m(i, p) : i, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (e = (a ? s(i, p, e) : s(e)) || e);
  return a && e && _(i, p, e), e;
};
let u = class extends g(o) {
  constructor() {
    super(...arguments), this._value = {};
  }
  set value(t) {
    if (!t) {
      this._value = {};
      return;
    }
    try {
      this._value = JSON.parse(t);
    } catch {
      this._value = {};
    }
  }
  get value() {
    return JSON.stringify(this._value);
  }
  _update(t, i) {
    this._value = { ...this._value, [t]: i }, this._dispatchChange();
  }
  _dispatchChange() {
    this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return v`
            <div class="spacing-container">
                <div class="input-group">
                    <uui-label>Top</uui-label>
                    <uui-input 
                        .value=${this._value.top ?? ""} 
                        @input=${(t) => this._update("top", t.target.value)}
                        placeholder="0px">
                    </uui-input>
                </div>
                <div class="input-group">
                    <uui-label>Right</uui-label>
                    <uui-input 
                        .value=${this._value.right ?? ""} 
                        @input=${(t) => this._update("right", t.target.value)}
                        placeholder="auto">
                    </uui-input>
                </div>
                <div class="input-group">
                    <uui-label>Bottom</uui-label>
                    <uui-input 
                        .value=${this._value.bottom ?? ""} 
                        @input=${(t) => this._update("bottom", t.target.value)}
                        placeholder="0px">
                    </uui-input>
                </div>
                <div class="input-group">
                    <uui-label>Left</uui-label>
                    <uui-input 
                        .value=${this._value.left ?? ""} 
                        @input=${(t) => this._update("left", t.target.value)}
                        placeholder="auto">
                    </uui-input>
                </div>
            </div>
        `;
  }
};
u.styles = c`
        .spacing-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-width: 600px;
        }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        uui-input {
            width: 100%;
        }
    `;
l([
  d()
], u.prototype, "_value", 2);
l([
  n({ attribute: !1 })
], u.prototype, "config", 2);
l([
  n({ type: String })
], u.prototype, "value", 1);
u = l([
  h("altigen-spacing-editor")
], u);
const x = u;
export {
  u as AltigenSpacingEditorElement,
  x as default
};
//# sourceMappingURL=spacing.element-CZtoDes3.js.map
