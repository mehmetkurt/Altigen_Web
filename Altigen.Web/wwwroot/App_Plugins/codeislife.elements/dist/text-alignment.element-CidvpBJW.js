import { LitElement as h, html as y, css as d, state as p, property as g, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as b } from "@umbraco-cms/backoffice/element-api";
var _ = Object.defineProperty, m = Object.getOwnPropertyDescriptor, r = (e, t, s, u) => {
  for (var l = u > 1 ? void 0 : u ? m(t, s) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (l = (u ? n(t, s, l) : n(l)) || l);
  return u && l && _(t, s, l), l;
};
let a = class extends b(h) {
  constructor() {
    super(...arguments), this._value = { value: "left", type: "Default (Inline Style)" }, this._displayValue = "", this._shouldDispatchChange = !1;
  }
  set config(e) {
    Array.isArray(e) ? this._config = e.reduce((t, s) => (t[s.alias] = s.value, t), {}) : this._config = e;
  }
  get config() {
    return this._config;
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
    var t, s, u, l;
    if (!this.config) {
      console.log("TextAlignment: Config is missing, skipping sync.");
      return;
    }
    let e = this.config.outputType ?? "Default (Inline Style)";
    if (console.log("TextAlignment: Raw OutputType from config:", e), Array.isArray(e) && (e = e[0], console.log("TextAlignment: Unwrapped Array OutputType:", e)), console.log("TextAlignment: Comparing Current Type:", this._value.type, "Target Type:", e), this._value.type !== e) {
      console.log("TextAlignment: Type Value Mismatch Detected! Healing...");
      let i = this._value.value;
      if (e === "Css Class" || Array.isArray(e) && e[0] === "Css Class") {
        const n = {
          left: ((t = this.config) == null ? void 0 : t.leftValue) ?? "left",
          center: ((s = this.config) == null ? void 0 : s.centerValue) ?? "center",
          right: ((u = this.config) == null ? void 0 : u.rightValue) ?? "right",
          justify: ((l = this.config) == null ? void 0 : l.justifyValue) ?? "justify"
        };
        i === "left" ? i = n.left : i === "center" ? i = n.center : i === "right" ? i = n.right : i === "justify" && (i = n.justify), console.log("TextAlignment: Remapped value to:", i);
      }
      this._value = {
        value: i,
        type: e
      }, console.log("TextAlignment: Value updated internally. Scheduling dispatch."), this._shouldDispatchChange = !0;
    }
  }
  _updateDisplayValue() {
    var i, n, o, c;
    const e = this._value.value, t = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", s = ((n = this.config) == null ? void 0 : n.centerValue) ?? "center", u = ((o = this.config) == null ? void 0 : o.rightValue) ?? "right", l = ((c = this.config) == null ? void 0 : c.justifyValue) ?? "justify";
    e === t ? this._displayValue = t : e === s ? this._displayValue = s : e === u ? this._displayValue = u : e === l ? this._displayValue = l : this._displayValue = e;
  }
  _setValue(e) {
    var u, l, i, n, o;
    const t = {
      left: ((u = this.config) == null ? void 0 : u.leftValue) ?? "left",
      center: ((l = this.config) == null ? void 0 : l.centerValue) ?? "center",
      right: ((i = this.config) == null ? void 0 : i.rightValue) ?? "right",
      justify: ((n = this.config) == null ? void 0 : n.justifyValue) ?? "justify"
    };
    let s = ((o = this.config) == null ? void 0 : o.outputType) ?? "Default (Inline Style)";
    Array.isArray(s) && (s = s[0]), this._value = {
      value: t[e],
      type: s
    }, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  render() {
    var i, n, o, c, f;
    const e = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", t = ((n = this.config) == null ? void 0 : n.centerValue) ?? "center", s = ((o = this.config) == null ? void 0 : o.rightValue) ?? "right", u = ((c = this.config) == null ? void 0 : c.justifyValue) ?? "justify", l = this._value.value;
    return y`
            <div class="wrapper">
                <!-- Debug Info: Remove display:none to see type mismatch issues -->
                <!-- Debug Info: Visible for debugging -->
                <div style="font-size:10px; color:red; border:1px solid red; padding:5px; margin-bottom:5px;">
                    <div><strong>Debug Info:</strong></div>
                    <div>Value: ${this._value.value}</div>
                    <div>Type: ${this._value.type}</div>
                    <div>Config Output: ${(f = this.config) == null ? void 0 : f.outputType}</div>
                </div>

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
                        class="btn ${l === s ? "selected" : ""}"
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
a.styles = d`
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
r([
  p()
], a.prototype, "_value", 2);
r([
  g({ attribute: !1 })
], a.prototype, "config", 1);
r([
  p()
], a.prototype, "_config", 2);
r([
  p()
], a.prototype, "_displayValue", 2);
r([
  g({ attribute: !1 })
], a.prototype, "value", 1);
a = r([
  v("codeislife-text-alignment")
], a);
const T = a;
export {
  a as CodeIsLifeTextAlignmentElement,
  T as default
};
