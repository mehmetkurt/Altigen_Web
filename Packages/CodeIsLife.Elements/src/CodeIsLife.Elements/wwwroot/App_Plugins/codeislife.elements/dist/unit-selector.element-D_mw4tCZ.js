import { LitElement as p, html as u, css as d, property as c, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as h } from "@umbraco-cms/backoffice/element-api";
var v = Object.defineProperty, m = Object.getOwnPropertyDescriptor, i = (e, r, n, s) => {
  for (var t = s > 1 ? void 0 : s ? m(r, n) : r, l = e.length - 1, a; l >= 0; l--)
    (a = e[l]) && (t = (s ? a(r, n, t) : a(t)) || t);
  return s && t && v(r, n, t), t;
};
let o = class extends h(p) {
  constructor() {
    super(...arguments), this.value = "px", this.units = ["px", "%", "em", "rem", "vw", "vh", "custom"], this.disabled = !1;
  }
  _selectUnit(e) {
    this.disabled || (this.value = e, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: e },
      bubbles: !0,
      composed: !0
    })));
  }
  render() {
    return u`
            <div class="unit-group">
                ${this.units.map((e) => u`
                    <button 
                        type="button"
                        class="unit-btn ${this.value === e ? "selected" : ""}"
                        @click=${() => this._selectUnit(e)}
                        ?disabled=${this.disabled}
                        title="${e === "custom" ? "Custom" : e}">
                        ${e === "custom" ? u`<uui-icon name="icon-edit" style="font-size: 12px;"></uui-icon>` : e}
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

        :host([disabled]) {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
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

        .unit-btn:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .unit-btn:hover:not(:disabled) {
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
i([
  c({ type: String })
], o.prototype, "value", 2);
i([
  c({ type: Array })
], o.prototype, "units", 2);
i([
  c({ type: Boolean, reflect: !0 })
], o.prototype, "disabled", 2);
o = i([
  b("codeislife-unit-selector")
], o);
