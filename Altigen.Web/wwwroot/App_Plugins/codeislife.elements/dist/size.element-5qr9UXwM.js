import { html as _, css as v, state as p, property as c, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as y } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-D_mw4tCZ.js";
var x = Object.defineProperty, b = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, l = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? b(t, i) : t, u = e.length - 1, h; u >= 0; u--)
    (h = e[u]) && (a = (r ? h(t, i, a) : h(a)) || a);
  return r && a && x(t, i, a), a;
}, g = (e, t, i) => t.has(e) || m("Cannot " + i), o = (e, t, i) => (g(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i, r) => (g(e, t, "write to private field"), t.set(e, i), i), n;
let s = class extends y(V, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 16, this._unit = "px", this._customValue = "", this._showToggle = !1, this._enabled = !0, $(this, n, ""), this.readonly = !1, this._min = 0, this._max = 100, this._step = 1;
  }
  set value(e) {
    const t = e ?? "";
    t === o(this, n) && o(this, n) !== "" || (d(this, n, t), this._parseValue(o(this, n)));
  }
  get value() {
    return o(this, n);
  }
  set config(e) {
    e && (this._min = e.getValueByAlias("min") ?? 0, this._max = e.getValueByAlias("max") ?? 100, this._max = e.getValueByAlias("max") ?? 100, this._step = e.getValueByAlias("step") ?? 1, this._showToggle = e.getValueByAlias("showToggle") ?? !1);
  }
  _parseValue(e) {
    let t = e, i = !0;
    try {
      if (e && e.trim().startsWith("{")) {
        const u = JSON.parse(e);
        t = u.value ?? "", i = u.enabled ?? !0;
      }
    } catch {
    }
    if (this._enabled = i, !t) {
      this._numericValue = 16, this._unit = "px", this._customValue = "";
      return;
    }
    const a = ["px", "%", "em", "rem", "vw", "vh"].find((u) => t.endsWith(u));
    if (a) {
      const u = t.substring(0, t.length - a.length), h = parseFloat(u);
      if (!isNaN(h)) {
        this._numericValue = h, this._unit = a, this._customValue = "";
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
    o(this, n) !== i && (d(this, n, i), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
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
n = /* @__PURE__ */ new WeakMap();
s.styles = v`
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
], s.prototype, "_numericValue", 2);
l([
  p()
], s.prototype, "_unit", 2);
l([
  p()
], s.prototype, "_customValue", 2);
l([
  p()
], s.prototype, "_showToggle", 2);
l([
  p()
], s.prototype, "_enabled", 2);
l([
  c({ type: String })
], s.prototype, "value", 1);
l([
  c({ type: Boolean, reflect: !0 })
], s.prototype, "readonly", 2);
l([
  c({ attribute: !1 })
], s.prototype, "config", 1);
s = l([
  f("size-editor")
], s);
const S = s;
export {
  s as SizeEditorElement,
  S as default
};
