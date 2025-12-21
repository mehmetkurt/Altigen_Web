import { html as _, css as y, state as p, property as c, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as V } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as b } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-D_mw4tCZ.js";
var x = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, g = (e) => {
  throw TypeError(e);
}, n = (e, t, i, u) => {
  for (var r = u > 1 ? void 0 : u ? $(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (u ? s(t, i, r) : s(r)) || r);
  return u && r && x(t, i, r), r;
}, f = (e, t, i) => t.has(e) || g("Cannot " + i), h = (e, t, i) => (f(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? g("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), m = (e, t, i, u) => (f(e, t, "write to private field"), t.set(e, i), i), l;
let a = class extends V(b, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 16, this._unit = "px", this._customValue = "", this._showToggle = !1, this._enabled = !1, w(this, l, ""), this.readonly = !1, this._min = 0, this._max = 100, this._step = 1;
  }
  set value(e) {
    let t = e ?? "";
    typeof t == "object" && t !== null && (t = JSON.stringify(t));
    const i = String(t);
    i === h(this, l) && h(this, l) !== "" || (m(this, l, i), this._parseValue(h(this, l)));
  }
  get value() {
    return h(this, l);
  }
  set config(e) {
    e && (this._min = e.getValueByAlias("min") ?? 0, this._max = e.getValueByAlias("max") ?? 100, this._max = e.getValueByAlias("max") ?? 100, this._step = e.getValueByAlias("step") ?? 1, this._showToggle = e.getValueByAlias("showToggle") ?? !1);
  }
  _parseValue(e) {
    let t = "";
    typeof e == "string" ? t = e : typeof e == "object" && e !== null ? t = JSON.stringify(e) : t = String(e ?? "");
    let i = t, u = !1;
    try {
      if (t && t.trim().startsWith("{")) {
        let s = JSON.parse(t);
        if (typeof s == "string")
          try {
            s.trim().startsWith("{") && (s = JSON.parse(s));
          } catch {
          }
        typeof s == "object" && s !== null && (i = s.value ? String(s.value) : "", u = s.enabled ?? !0);
      } else
        t.trim().length > 0 && (u = !0);
    } catch {
      t.trim().length > 0 && (u = !0);
    }
    if (this._enabled = u, !i) {
      this._numericValue = 16, this._unit = "px", this._customValue = "";
      return;
    }
    const o = ["px", "%", "em", "rem", "vw", "vh"].find((s) => i.endsWith(s));
    if (o) {
      const s = i.substring(0, i.length - o.length), d = parseFloat(s);
      if (!isNaN(d)) {
        this._numericValue = d, this._unit = o, this._customValue = "";
        return;
      }
    }
    this._unit = "custom", this._customValue = i;
  }
  _updateValue() {
    let e;
    this._unit === "custom" ? e = this._customValue : e = `${this._numericValue}${this._unit}`;
    const t = {
      value: e,
      enabled: this._enabled
    }, i = JSON.stringify(t);
    h(this, l) !== i && (m(this, l, i), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
  }
  _onUnitChange(e) {
    e.stopPropagation();
    const t = e.detail.value;
    if (t === "custom")
      this._customValue || (this._customValue = `${this._numericValue}${this._unit}`);
    else if (this._unit === "custom" && this._customValue) {
      const i = parseFloat(this._customValue);
      isNaN(i) || (this._numericValue = i);
    }
    this._unit = t, this._updateValue();
  }
  _onSliderChange(e) {
    this._numericValue = Number(e.target.value), this._updateValue();
  }
  _onNumericInputChange(e) {
    e.stopPropagation(), this._numericValue = Number(e.target.value), this._updateValue();
  }
  _onCustomInputChange(e) {
    this._customValue = e.target.value, this._updateValue();
  }
  _onToggleChange(e) {
    e.stopPropagation(), this._enabled = e.target.checked, this._updateValue();
  }
  render() {
    return _`
            <div class="wrapper">
                <div class="header">
                    ${this._showToggle ? _`<uui-toggle label="Enable/Disable" .checked=${this._enabled} @change=${this._onToggleChange} compact>Enabled</uui-toggle>` : ""}
                    <codeislife-unit-selector
                        .value=${this._unit}
                        @change=${this._onUnitChange}
                        ?disabled=${!this._enabled}>
                    </codeislife-unit-selector>
                </div>
                <div class="controls">
                    ${this._unit !== "custom" ? _`
                            <uui-slider
                                .min=${this._min}
                                .max=${this._max}
                                .step=${this._step}
                                .value=${this._numericValue}
                                @input=${this._onSliderChange}
                                ?disabled=${this.readonly || !this._enabled}>
                            </uui-slider>
                            <uui-input
                                type="number"
                                .value=${this._numericValue}
                                @change=${this._onNumericInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                style="width: 80px;">
                            </uui-input>
                        ` : _`
                             <uui-input
                                type="text"
                                .value=${this._customValue}
                                @input=${this._onCustomInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                placeholder="Enter value (e.g. clamp(1rem, 2vw, 3rem))"
                                style="width: 100%;">
                            </uui-input>
                        `}
                </div>
            </div>
        `;
  }
};
l = /* @__PURE__ */ new WeakMap();
a.styles = y`
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
            gap: 5px;
            align-items: center;
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
n([
  p()
], a.prototype, "_numericValue", 2);
n([
  p()
], a.prototype, "_unit", 2);
n([
  p()
], a.prototype, "_customValue", 2);
n([
  p()
], a.prototype, "_showToggle", 2);
n([
  p()
], a.prototype, "_enabled", 2);
n([
  c({ type: String }),
  c({ type: String })
], a.prototype, "value", 1);
n([
  c({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
n([
  c({ attribute: !1 })
], a.prototype, "config", 1);
a = n([
  v("size-editor")
], a);
const O = a;
export {
  a as SizeEditorElement,
  O as default
};
