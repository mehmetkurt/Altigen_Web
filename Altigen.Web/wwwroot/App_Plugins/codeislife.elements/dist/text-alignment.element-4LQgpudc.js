import { LitElement as g, html as h, css as y, state as p, property as f, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as v } from "@umbraco-cms/backoffice/element-api";
var b = Object.defineProperty, m = Object.getOwnPropertyDescriptor, c = (e, t, n, u) => {
  for (var l = u > 1 ? void 0 : u ? m(t, n) : t, i = e.length - 1, s; i >= 0; i--)
    (s = e[i]) && (l = (u ? s(t, n, l) : s(l)) || l);
  return u && l && b(t, n, l), l;
};
let o = class extends v(g) {
  constructor() {
    super(...arguments), this._value = { value: "left", type: "Default (Inline Style)" }, this._displayValue = "", this._shouldDispatchChange = !1;
  }
  set value(e) {
    if (!e) {
      this._value = { value: "left", type: "Default (Inline Style)" };
      return;
    }
    if (typeof e == "object") {
      const t = e;
      this._value = {
        value: t.value ?? "left",
        type: t.type ?? "Default (Inline Style)"
      };
      return;
    }
    try {
      const t = JSON.parse(e);
      t && typeof t == "object" && "value" in t ? this._value = t : this._value = { value: e, type: "Default (Inline Style)" };
    } catch {
      this._value = { value: e, type: "Default (Inline Style)" };
    }
  }
  get value() {
    return this._value;
  }
  connectedCallback() {
    super.connectedCallback(), this._updateDisplayValue();
  }
  updated(e) {
    super.updated(e), this._shouldDispatchChange && (console.log("TextAlignment: Dispatching property-value-change event."), this._shouldDispatchChange = !1, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })));
  }
  willUpdate(e) {
    var t;
    (e.has("value") || e.has("config")) && (console.group("TextAlignment Debug"), console.log("Current Config:", this.config), console.log("Raw Output Type:", (t = this.config) == null ? void 0 : t.outputType), this._syncTypeWithConfig(), this._updateDisplayValue(), console.groupEnd());
  }
  _syncTypeWithConfig() {
    var t, n, u, l;
    if (!this.config) {
      console.log("TextAlignment: Config is missing, skipping sync.");
      return;
    }
    let e = this.config.outputType ?? "Default (Inline Style)";
    if (console.log("TextAlignment: Raw OutputType from config:", e), Array.isArray(e) && (e = e[0], console.log("TextAlignment: Unwrapped Array OutputType:", e)), console.log("TextAlignment: Comparing Current Type:", this._value.type, "Target Type:", e), this._value.type !== e) {
      console.log("TextAlignment: Type Value Mismatch Detected! Healing...");
      let i = this._value.value;
      if (e === "Css Class" || Array.isArray(e) && e[0] === "Css Class") {
        const s = {
          left: ((t = this.config) == null ? void 0 : t.leftValue) ?? "left",
          center: ((n = this.config) == null ? void 0 : n.centerValue) ?? "center",
          right: ((u = this.config) == null ? void 0 : u.rightValue) ?? "right",
          justify: ((l = this.config) == null ? void 0 : l.justifyValue) ?? "justify"
        };
        i === "left" ? i = s.left : i === "center" ? i = s.center : i === "right" ? i = s.right : i === "justify" && (i = s.justify), console.log("TextAlignment: Remapped value to:", i);
      }
      this._value = {
        value: i,
        type: e
      }, console.log("TextAlignment: Value updated internally. Scheduling dispatch."), this._shouldDispatchChange = !0;
    }
  }
  _updateDisplayValue() {
    var i, s, a, r;
    const e = this._value.value, t = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", n = ((s = this.config) == null ? void 0 : s.centerValue) ?? "center", u = ((a = this.config) == null ? void 0 : a.rightValue) ?? "right", l = ((r = this.config) == null ? void 0 : r.justifyValue) ?? "justify";
    e === t ? this._displayValue = t : e === n ? this._displayValue = n : e === u ? this._displayValue = u : e === l ? this._displayValue = l : this._displayValue = e;
  }
  _setValue(e) {
    var u, l, i, s, a;
    const t = {
      left: ((u = this.config) == null ? void 0 : u.leftValue) ?? "left",
      center: ((l = this.config) == null ? void 0 : l.centerValue) ?? "center",
      right: ((i = this.config) == null ? void 0 : i.rightValue) ?? "right",
      justify: ((s = this.config) == null ? void 0 : s.justifyValue) ?? "justify"
    };
    let n = ((a = this.config) == null ? void 0 : a.outputType) ?? "Default (Inline Style)";
    Array.isArray(n) && (n = n[0]), this._value = {
      value: t[e],
      type: n
    }, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  render() {
    var i, s, a, r;
    const e = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", t = ((s = this.config) == null ? void 0 : s.centerValue) ?? "center", n = ((a = this.config) == null ? void 0 : a.rightValue) ?? "right", u = ((r = this.config) == null ? void 0 : r.justifyValue) ?? "justify", l = this._value.value;
    return h`
            <div class="wrapper">
                <!-- Debug Info: Remove display:none to see type mismatch issues -->
                <div style="font-size:10px; color:red; display:none;">Type: ${this._value.type}</div>

                <div class="button-group">
                    <button
                        type="button"
                        class="btn ${l === e ? "selected" : ""}"
                        @click=${() => this._setValue("left")}
                        title="Align Left">
                        <uui-icon name="icon-text-align-left"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${l === t ? "selected" : ""}"
                        @click=${() => this._setValue("center")}
                        title="Align Center">
                        <uui-icon name="icon-text-align-center"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${l === n ? "selected" : ""}"
                        @click=${() => this._setValue("right")}
                        title="Align Right">
                        <uui-icon name="icon-text-align-right"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${l === u ? "selected" : ""}"
                        @click=${() => this._setValue("justify")}
                        title="Justify">
                        <uui-icon name="icon-text-align-justify"></uui-icon>
                    </button>
                </div>
                <span class="value-label">${this._displayValue}</span>
            </div>
        `;
  }
};
o.styles = y`
        :host {
            display: block;
        }

        .wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
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
            display: block;
        }

        .value-label {
            font-size: 0.9rem;
            color: var(--uui-color-text);
            opacity: 0.8;
        }
    `;
c([
  p()
], o.prototype, "_value", 2);
c([
  f({ attribute: !1 })
], o.prototype, "config", 2);
c([
  p()
], o.prototype, "_displayValue", 2);
c([
  f({ attribute: !1 })
], o.prototype, "value", 1);
o = c([
  d("codeislife-text-alignment")
], o);
const x = o;
export {
  o as CodeIsLifeTextAlignmentElement,
  x as default
};
