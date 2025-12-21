import { html as _, css as f, state as p, property as d, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as y } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-D_mw4tCZ.js";
var x = Object.defineProperty, b = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, l = (e, t, i, h) => {
  for (var u = h > 1 ? void 0 : h ? b(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (u = (h ? o(t, i, u) : o(u)) || u);
  return h && u && x(t, i, u), u;
}, g = (e, t, i) => t.has(e) || m("Cannot " + i), r = (e, t, i) => (g(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), c = (e, t, i, h) => (g(e, t, "write to private field"), t.set(e, i), i), s;
let a = class extends y(V, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 16, this._unit = "px", this._customValue = "", this._showToggle = !1, this._enabled = !0, $(this, s, ""), this.readonly = !1, this._min = 0, this._max = 100, this._step = 1;
  }
  set value(e) {
    const t = e ?? "";
    t === r(this, s) && r(this, s) !== "" || (c(this, s, t), this._parseValue(r(this, s)));
  }
  get value() {
    return r(this, s);
  }
  set config(e) {
    e && (this._min = e.getValueByAlias("min") ?? 0, this._max = e.getValueByAlias("max") ?? 100, this._max = e.getValueByAlias("max") ?? 100, this._step = e.getValueByAlias("step") ?? 1, this._showToggle = e.getValueByAlias("showToggle") ?? !1);
  }
  _parseValue(e) {
    let t = e, i = !0;
    try {
      if (e && e.trim().startsWith("{")) {
        const n = JSON.parse(e);
        t = n.value ?? "", i = n.enabled ?? !0;
      }
    } catch {
    }
    if (this._enabled = i, !t) {
      this._numericValue = 16, this._unit = "px", this._customValue = "";
      return;
    }
    const u = ["px", "%", "em", "rem", "vw", "vh"].find((n) => e.endsWith(n));
    if (u) {
      const n = e.substring(0, e.length - u.length), o = parseFloat(n);
      if (!isNaN(o)) {
        this._numericValue = o, this._unit = u, this._customValue = "";
        return;
      }
    }
    this._unit = "custom", this._customValue = e;
  }
  _updateValue() {
    let e;
    this._unit === "custom" ? e = this._customValue : e = `${this._numericValue}${this._unit}`;
    const t = {
      value: e,
      enabled: this._enabled
    }, i = JSON.stringify(t);
    r(this, s) !== i && (c(this, s, i), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
  }
  _onUnitChange(e) {
    const t = e.detail.value;
    if (t === "custom")
      !this._customValue && r(this, s) && (this._customValue = r(this, s));
    else {
      const i = parseFloat(r(this, s));
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
s = /* @__PURE__ */ new WeakMap();
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
l([
  p()
], a.prototype, "_numericValue", 2);
l([
  p()
], a.prototype, "_unit", 2);
l([
  p()
], a.prototype, "_customValue", 2);
l([
  p()
], a.prototype, "_showToggle", 2);
l([
  p()
], a.prototype, "_enabled", 2);
l([
  d({ type: String })
], a.prototype, "value", 1);
l([
  d({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
l([
  d({ attribute: !1 })
], a.prototype, "config", 1);
a = l([
  v("size-editor")
], a);
const S = a;
export {
  a as SizeEditorElement,
  S as default
};
