import { LitElement as p, html as l, css as d, property as c, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as v } from "@umbraco-cms/backoffice/element-api";
var b = Object.defineProperty, h = Object.getOwnPropertyDescriptor, a = (e, r, i, s) => {
  for (var t = s > 1 ? void 0 : s ? h(r, i) : r, n = e.length - 1, u; n >= 0; n--)
    (u = e[n]) && (t = (s ? u(r, i, t) : u(t)) || t);
  return s && t && b(r, i, t), t;
};
let o = class extends v(p) {
  constructor() {
    super(...arguments), this.value = "px", this.units = ["px", "%", "em", "rem", "vw", "vh", "custom"];
  }
  _selectUnit(e) {
    this.value = e, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: e },
      bubbles: !0,
      composed: !0
    }));
  }
  render() {
    return l`
            <div class="unit-group">
                ${this.units.map((e) => l`
                    <button 
                        type="button"
                        class="unit-btn ${this.value === e ? "selected" : ""}"
                        @click=${() => this._selectUnit(e)}
                        title="${e === "custom" ? "Custom" : e}">
                        ${e === "custom" ? l`<uui-icon name="icon-edit" style="font-size: 12px;"></uui-icon>` : e}
                    </button>
                `)}
            </div>
        `;
  }
};
o.styles = d`
        :host {
            display: inline-block;
        }

        .unit-group {
            display: flex;
            background: var(--uui-color-surface-alt);
            border-radius: 4px;
            padding: 2px;
            gap: 2px;
        }

        .unit-btn {
            background: transparent;
            border: none;
            border-radius: 3px;
            font-family: inherit;
            font-size: 10px;
            font-weight: 500;
            color: var(--uui-color-text-alt);
            cursor: pointer;
            padding: 4px 6px;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .unit-btn:hover {
            color: var(--uui-color-text);
            background: var(--uui-color-surface-emphasis);
            opacity: 0.7;
        }

        .unit-btn.selected {
            background: var(--uui-color-selected);
            color: var(--uui-color-selected-contrast);
            font-weight: 700;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
    `;
a([
  c({ type: String })
], o.prototype, "value", 2);
a([
  c({ type: Array })
], o.prototype, "units", 2);
o = a([
  m("codeislife-unit-selector")
], o);
