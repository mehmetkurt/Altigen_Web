import { LitElement as p, html as f, css as h, property as c, state as d, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as b } from "@umbraco-cms/backoffice/element-api";
var y = Object.defineProperty, v = Object.getOwnPropertyDescriptor, r = (e, s, a, i) => {
  for (var t = i > 1 ? void 0 : i ? v(s, a) : s, l = e.length - 1, u; l >= 0; l--)
    (u = e[l]) && (t = (i ? u(s, a, t) : u(t)) || t);
  return i && t && y(s, a, t), t;
};
let n = class extends b(p) {
  constructor() {
    super(...arguments), this.value = "left", this._displayValue = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._updateDisplayValue();
  }
  willUpdate(e) {
    (e.has("value") || e.has("config")) && this._updateDisplayValue();
  }
  _updateDisplayValue() {
    var t, l, u, o;
    const e = ((t = this.config) == null ? void 0 : t.leftValue) ?? "left", s = ((l = this.config) == null ? void 0 : l.centerValue) ?? "center", a = ((u = this.config) == null ? void 0 : u.rightValue) ?? "right", i = ((o = this.config) == null ? void 0 : o.justifyValue) ?? "justify";
    this.value === e ? this._displayValue = e : this.value === s ? this._displayValue = s : this.value === a ? this._displayValue = a : this.value === i ? this._displayValue = i : this._displayValue = this.value;
  }
  _setValue(e) {
    var a, i, t, l;
    const s = {
      left: ((a = this.config) == null ? void 0 : a.leftValue) ?? "left",
      center: ((i = this.config) == null ? void 0 : i.centerValue) ?? "center",
      right: ((t = this.config) == null ? void 0 : t.rightValue) ?? "right",
      justify: ((l = this.config) == null ? void 0 : l.justifyValue) ?? "justify"
    };
    this.value = s[e], this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    var t, l, u, o;
    const e = ((t = this.config) == null ? void 0 : t.leftValue) ?? "left", s = ((l = this.config) == null ? void 0 : l.centerValue) ?? "center", a = ((u = this.config) == null ? void 0 : u.rightValue) ?? "right", i = ((o = this.config) == null ? void 0 : o.justifyValue) ?? "justify";
    return f`
            <div class="wrapper">
                <div class="button-group">
                    <button
                        type="button"
                        class="btn ${this.value === e ? "selected" : ""}"
                        @click=${() => this._setValue("left")}
                        title="Align Left">
                        <uui-icon name="icon-text-align-left"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${this.value === s ? "selected" : ""}"
                        @click=${() => this._setValue("center")}
                        title="Align Center">
                        <uui-icon name="icon-text-align-center"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${this.value === a ? "selected" : ""}"
                        @click=${() => this._setValue("right")}
                        title="Align Right">
                        <uui-icon name="icon-text-align-right"></uui-icon>
                    </button>
                    <button
                        type="button"
                        class="btn ${this.value === i ? "selected" : ""}"
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
n.styles = h`
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
  c({ type: String })
], n.prototype, "value", 2);
r([
  c({ attribute: !1 })
], n.prototype, "config", 2);
r([
  d()
], n.prototype, "_displayValue", 2);
n = r([
  g("codeislife-text-alignment")
], n);
const _ = n;
export {
  n as CodeIsLifeTextAlignmentElement,
  _ as default
};
