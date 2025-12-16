import { LitElement as h, html as y, css as g, state as f, property as p, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as v } from "@umbraco-cms/backoffice/element-api";
var b = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, o = (e, t, s, a) => {
  for (var l = a > 1 ? void 0 : a ? _(t, s) : t, i = e.length - 1, u; i >= 0; i--)
    (u = e[i]) && (l = (a ? u(t, s, l) : u(l)) || l);
  return a && l && b(t, s, l), l;
};
let n = class extends v(h) {
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
    super.updated(e), this._shouldDispatchChange && (this._shouldDispatchChange = !1, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })));
  }
  willUpdate(e) {
    (e.has("value") || e.has("config")) && (this._syncTypeWithConfig(), this._updateDisplayValue());
  }
  _syncTypeWithConfig() {
    var t, s, a, l;
    if (!this.config) return;
    let e = this.config.outputType ?? "Default (Inline Style)";
    if (Array.isArray(e) && (e = e[0]), this._value.type !== e) {
      let i = this._value.value;
      if (e === "Css Class" || Array.isArray(e) && e[0] === "Css Class") {
        const u = {
          left: ((t = this.config) == null ? void 0 : t.leftValue) ?? "left",
          center: ((s = this.config) == null ? void 0 : s.centerValue) ?? "center",
          right: ((a = this.config) == null ? void 0 : a.rightValue) ?? "right",
          justify: ((l = this.config) == null ? void 0 : l.justifyValue) ?? "justify"
        };
        i === "left" ? i = u.left : i === "center" ? i = u.center : i === "right" ? i = u.right : i === "justify" && (i = u.justify);
      }
      this._value = {
        value: i,
        type: e
      }, this._shouldDispatchChange = !0;
    }
  }
  _updateDisplayValue() {
    var i, u, r, c;
    const e = this._value.value, t = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", s = ((u = this.config) == null ? void 0 : u.centerValue) ?? "center", a = ((r = this.config) == null ? void 0 : r.rightValue) ?? "right", l = ((c = this.config) == null ? void 0 : c.justifyValue) ?? "justify";
    e === t ? this._displayValue = t : e === s ? this._displayValue = s : e === a ? this._displayValue = a : e === l ? this._displayValue = l : this._displayValue = e;
  }
  _setValue(e) {
    var a, l, i, u, r;
    const t = {
      left: ((a = this.config) == null ? void 0 : a.leftValue) ?? "left",
      center: ((l = this.config) == null ? void 0 : l.centerValue) ?? "center",
      right: ((i = this.config) == null ? void 0 : i.rightValue) ?? "right",
      justify: ((u = this.config) == null ? void 0 : u.justifyValue) ?? "justify"
    };
    let s = ((r = this.config) == null ? void 0 : r.outputType) ?? "Default (Inline Style)";
    Array.isArray(s) && (s = s[0]), this._value = {
      value: t[e],
      type: s
    }, this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  render() {
    var i, u, r, c;
    const e = ((i = this.config) == null ? void 0 : i.leftValue) ?? "left", t = ((u = this.config) == null ? void 0 : u.centerValue) ?? "center", s = ((r = this.config) == null ? void 0 : r.rightValue) ?? "right", a = ((c = this.config) == null ? void 0 : c.justifyValue) ?? "justify", l = this._value.value;
    return y`
            <div class="wrapper">
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
                        class="btn ${l === a ? "selected" : ""}"
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
n.styles = g`
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
o([
  f()
], n.prototype, "_value", 2);
o([
  p({ attribute: !1 })
], n.prototype, "config", 1);
o([
  f()
], n.prototype, "_config", 2);
o([
  f()
], n.prototype, "_displayValue", 2);
o([
  p({ attribute: !1 })
], n.prototype, "value", 1);
n = o([
  d("codeislife-text-alignment")
], n);
const x = n;
export {
  n as CodeIsLifeTextAlignmentElement,
  x as default
};
