import { html as p, css as v, state as c, property as _, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as y } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-VSuXczPN.js";
var x = Object.defineProperty, w = Object.getOwnPropertyDescriptor, d = (t) => {
  throw TypeError(t);
}, l = (t, e, i, n) => {
  for (var u = n > 1 ? void 0 : n ? w(e, i) : e, h = t.length - 1, o; h >= 0; h--)
    (o = t[h]) && (u = (n ? o(e, i, u) : o(u)) || u);
  return n && u && x(e, i, u), u;
}, f = (t, e, i) => e.has(t) || d("Cannot " + i), r = (t, e, i) => (f(t, e, "read from private field"), i ? i.call(t) : e.get(t)), $ = (t, e, i) => e.has(t) ? d("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), m = (t, e, i, n) => (f(t, e, "write to private field"), e.set(t, i), i), s;
let a = class extends y(V, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 16, this._unit = "px", this._customValue = "", $(this, s, ""), this.readonly = !1, this._min = 0, this._max = 100, this._step = 1;
  }
  set value(t) {
    const e = t ?? "";
    e === r(this, s) && r(this, s) !== "" || (m(this, s, e), this._parseValue(r(this, s)));
  }
  get value() {
    return r(this, s);
  }
  set config(t) {
    t && (this._min = t.getValueByAlias("min") ?? 0, this._max = t.getValueByAlias("max") ?? 100, this._step = t.getValueByAlias("step") ?? 1);
  }
  _parseValue(t) {
    if (!t) {
      this._numericValue = 16, this._unit = "px", this._customValue = "";
      return;
    }
    const i = ["px", "%", "em", "rem", "vw", "vh"].find((n) => t.endsWith(n));
    if (i) {
      const n = t.substring(0, t.length - i.length), u = parseFloat(n);
      if (!isNaN(u)) {
        this._numericValue = u, this._unit = i, this._customValue = "";
        return;
      }
    }
    this._unit = "custom", this._customValue = t;
  }
  _updateValue() {
    let t;
    this._unit === "custom" ? t = this._customValue : t = `${this._numericValue}${this._unit}`, r(this, s) !== t && (m(this, s, t), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
  }
  _onUnitChange(t) {
    const e = t.detail.value;
    if (e === "custom")
      !this._customValue && r(this, s) && (this._customValue = r(this, s));
    else {
      const i = parseFloat(r(this, s));
      isNaN(i) || (this._numericValue = i);
    }
    this._unit = e, this._updateValue();
  }
  _onSliderChange(t) {
    this._numericValue = Number(t.target.value), this._updateValue();
  }
  _onNumericInputChange(t) {
    this._numericValue = Number(t.target.value), this._updateValue();
  }
  _onCustomInputChange(t) {
    this._customValue = t.target.value, this._updateValue();
  }
  render() {
    return p`
            <div class="wrapper">
                <div class="header">
                    <codeislife-unit-selector
                        .value=${this._unit}
                        @change=${this._onUnitChange}>
                    </codeislife-unit-selector>
                </div>
                <div class="controls">
                    ${this._unit !== "custom" ? p`
                            <uui-slider
                                .min=${this._min}
                                .max=${this._max}
                                .step=${this._step}
                                .value=${this._numericValue}
                                @input=${this._onSliderChange}
                                ?disabled=${this.readonly}>
                            </uui-slider>
                            <uui-input
                                type="number"
                                .value=${this._numericValue}
                                @change=${this._onNumericInputChange}
                                ?readonly=${this.readonly}
                                style="width: 80px;">
                            </uui-input>
                        ` : p`
                             <uui-input
                                type="text"
                                .value=${this._customValue}
                                @input=${this._onCustomInputChange}
                                ?readonly=${this.readonly}
                                placeholder="Enter value (e.g. clamp(1rem, 2vw, 3rem))"
                                style="width: 100%;">
                            </uui-input>
                        `}
                </div>
            </div>
        `;
  }
};
s = /* @__PURE__ */ new WeakMap();
a.styles = v`
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
    `;
l([
  c()
], a.prototype, "_numericValue", 2);
l([
  c()
], a.prototype, "_unit", 2);
l([
  c()
], a.prototype, "_customValue", 2);
l([
  _({ type: String })
], a.prototype, "value", 1);
l([
  _({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
l([
  _({ attribute: !1 })
], a.prototype, "config", 1);
a = l([
  g("size-editor")
], a);
const S = a;
export {
  a as SizeEditorElement,
  S as default
};
