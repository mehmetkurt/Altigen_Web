import { html as _, css as f, state as p, property as c, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as y } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-D_mw4tCZ.js";
var x = Object.defineProperty, b = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, n = (e, t, i, r) => {
  for (var u = r > 1 ? void 0 : r ? b(t, i) : t, s = e.length - 1, h; s >= 0; s--)
    (h = e[s]) && (u = (r ? h(t, i, u) : h(u)) || u);
  return r && u && x(t, i, u), u;
}, g = (e, t, i) => t.has(e) || m("Cannot " + i), o = (e, t, i) => (g(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i, r) => (g(e, t, "write to private field"), t.set(e, i), i), l;
let a = class extends y(V, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 16, this._unit = "px", this._customValue = "", this._showToggle = !1, this._enabled = !0, $(this, l, ""), this.readonly = !1, this._min = 0, this._max = 100, this._step = 1;
  }
  set value(e) {
    const t = e ?? "";
    t === o(this, l) && o(this, l) !== "" || (d(this, l, t), this._parseValue(o(this, l)));
  }
  get value() {
    return o(this, l);
  }
  set config(e) {
    e && (this._min = e.getValueByAlias("min") ?? 0, this._max = e.getValueByAlias("max") ?? 100, this._max = e.getValueByAlias("max") ?? 100, this._step = e.getValueByAlias("step") ?? 1, this._showToggle = e.getValueByAlias("showToggle") ?? !1);
  }
  _parseValue(e) {
    let t = e, i = !0;
    try {
      if (e && e.trim().startsWith("{")) {
        let s = JSON.parse(e);
        if (typeof s == "string")
          try {
            s.trim().startsWith("{") && (s = JSON.parse(s));
          } catch {
          }
        typeof s == "object" && s !== null && (t = s.value ?? "", i = s.enabled ?? !0);
      }
    } catch {
    }
    if (this._enabled = i, !t) {
      this._numericValue = 16, this._unit = "px", this._customValue = "";
      return;
    }
    const u = ["px", "%", "em", "rem", "vw", "vh"].find((s) => t.endsWith(s));
    if (u) {
      const s = t.substring(0, t.length - u.length), h = parseFloat(s);
      if (!isNaN(h)) {
        this._numericValue = h, this._unit = u, this._customValue = "";
        return;
      }
    }
    this._unit = "custom", this._customValue = t;
  }
  _updateValue() {
    let e;
    this._unit === "custom" ? e = this._customValue : e = `${this._numericValue}${this._unit}`;
    const t = {
      value: e,
      enabled: this._enabled
    }, i = JSON.stringify(t);
    o(this, l) !== i && (d(this, l, i), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
  }
  _onUnitChange(e) {
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
    this._numericValue = Number(e.target.value), this._updateValue();
  }
  _onCustomInputChange(e) {
    this._customValue = e.target.value, this._updateValue();
  }
  _onToggleChange(e) {
    this._enabled = e.target.checked, this._updateValue();
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
a.styles = f`
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
const S = a;
export {
  a as SizeEditorElement,
  S as default
};
