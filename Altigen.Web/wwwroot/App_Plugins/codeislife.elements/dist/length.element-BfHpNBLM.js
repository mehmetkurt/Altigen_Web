import { html as c, css as v, state as p, property as _, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as V } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as b } from "@umbraco-cms/backoffice/lit-element";
import "./unit-selector.element-D_mw4tCZ.js";
var x = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, f = (e) => {
  throw TypeError(e);
}, l = (e, t, i, u) => {
  for (var r = u > 1 ? void 0 : u ? $(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (u ? s(t, i, r) : s(r)) || r);
  return u && r && x(t, i, r), r;
}, g = (e, t, i) => t.has(e) || f("Cannot " + i), h = (e, t, i) => (g(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? f("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), m = (e, t, i, u) => (g(e, t, "write to private field"), t.set(e, i), i), a;
let n = class extends V(b, void 0) {
  constructor() {
    super(...arguments), this._numericValue = 0, this._unit = "px", this._customValue = "", this._enabled = !0, w(this, a, ""), this.readonly = !1;
  }
  set value(e) {
    let t = e ?? "";
    typeof t == "object" && t !== null && (t = JSON.stringify(t));
    const i = String(t);
    i === h(this, a) && h(this, a) !== "" || (m(this, a, i), this._parseValue(h(this, a)));
  }
  get value() {
    return h(this, a);
  }
  set config(e) {
  }
  _parseValue(e) {
    let t = "";
    typeof e == "string" ? t = e : typeof e == "object" && e !== null ? t = JSON.stringify(e) : t = String(e ?? ""), t === "[object Object]" && (t = "");
    let i = t, u = !0;
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
      this._numericValue = 0, this._unit = "px", this._customValue = "";
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
    h(this, a) !== i && (m(this, a, i), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 })));
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
  _onNumericInputChange(e) {
    e.stopPropagation(), this._numericValue = Number(e.target.value), this._updateValue();
  }
  _onCustomInputChange(e) {
    this._customValue = e.target.value, this._updateValue();
  }
  render() {
    return c`
            <div class="wrapper">
                <div class="controls">
                     ${this._unit !== "custom" ? c`
                             <uui-input
                                type="number"
                                .value=${this._numericValue}
                                @change=${this._onNumericInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                label="Length value"
                                style="width: 100%;">
                            </uui-input>
                        ` : c`
                             <uui-input
                                type="text"
                                .value=${this._customValue}
                                @input=${this._onCustomInputChange}
                                ?readonly=${this.readonly}
                                ?disabled=${!this._enabled}
                                placeholder="Enter value (e.g. auto, 100% - 20px)"
                                label="Custom length value"
                                style="width: 100%;">
                            </uui-input>
                        `}
                    <codeislife-unit-selector
                        .value=${this._unit}
                        @change=${this._onUnitChange}
                        ?disabled=${!this._enabled}>
                    </codeislife-unit-selector>
                </div>
            </div>
        `;
  }
};
a = /* @__PURE__ */ new WeakMap();
n.styles = v`
        :host {
            display: block;
        }
        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 5px;
            width: 100%;
        }
        uui-input {
            flex: 1;
            --uui-input-height: 30px;
            min-height: 30px;
        }
        codeislife-unit-selector {
            flex-shrink: 0;
        }
    `;
l([
  p()
], n.prototype, "_numericValue", 2);
l([
  p()
], n.prototype, "_unit", 2);
l([
  p()
], n.prototype, "_customValue", 2);
l([
  p()
], n.prototype, "_enabled", 2);
l([
  _({ type: String })
], n.prototype, "value", 1);
l([
  _({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 2);
l([
  _({ attribute: !1 })
], n.prototype, "config", 1);
n = l([
  y("length-editor")
], n);
const O = n;
export {
  n as LengthEditorElement,
  O as default
};
