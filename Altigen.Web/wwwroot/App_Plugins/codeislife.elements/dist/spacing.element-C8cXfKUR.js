import { LitElement as d, html as c, css as h, property as l, customElement as v, state as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
var x = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, u = (t, e, o, a) => {
  for (var i = a > 1 ? void 0 : a ? _(e, o) : e, r = t.length - 1, p; r >= 0; r--)
    (p = t[r]) && (i = (a ? p(e, o, i) : p(i)) || i);
  return a && i && x(e, o, i), i;
};
let n = class extends g(d) {
  constructor() {
    super(...arguments), this.value = "px", this.units = ["px", "%", "em", "rem", "vw", "vh"];
  }
  _selectUnit(t) {
    this.value = t, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: t },
      bubbles: !0,
      composed: !0
    }));
  }
  render() {
    return c`
            <div class="unit-group">
                ${this.units.map((t) => c`
                    <button 
                        type="button"
                        class="unit-btn ${this.value === t ? "selected" : ""}"
                        @click=${() => this._selectUnit(t)}>
                        ${t}
                    </button>
                `)}
            </div>
        `;
  }
};
n.styles = h`
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
u([
  l({ type: String })
], n.prototype, "value", 2);
u([
  l({ type: Array })
], n.prototype, "units", 2);
n = u([
  v("codeislife-unit-selector")
], n);
let s = class extends g(d) {
  constructor() {
    super(...arguments), this._value = { unit: "px", isLinked: !0 };
  }
  set value(t) {
    if (!t) {
      this._value = { unit: "px", isLinked: !0 };
      return;
    }
    if (typeof t == "object") {
      this._value = { unit: "px", isLinked: !0, ...t };
      return;
    }
    try {
      const e = JSON.parse(t);
      this._value = {
        unit: "px",
        isLinked: !0,
        ...e
      };
    } catch {
      this._value = { unit: "px", isLinked: !0 };
    }
  }
  get value() {
    return this._value;
  }
  _update(t, e) {
    this._value.isLinked ? this._value = {
      ...this._value,
      top: e,
      right: e,
      bottom: e,
      left: e
    } : this._value = { ...this._value, [t]: e }, this._dispatchChange();
  }
  _toggleLink() {
    if (this._value = { ...this._value, isLinked: !this._value.isLinked }, this._value.isLinked) {
      const t = this._value.top || this._value.right || this._value.bottom || this._value.left || "";
      this._value = {
        ...this._value,
        top: t,
        right: t,
        bottom: t,
        left: t
      }, this._dispatchChange();
    } else
      this.requestUpdate();
  }
  _dispatchChange() {
    this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return c`
            <div class="spacing-wrapper">
                
                <div class="header-controls">
                    <codeislife-unit-selector
                        .value=${this._value.unit || "px"}
                        @change=${(t) => {
      this._value = { ...this._value, unit: t.detail.value }, this._dispatchChange();
    }}>
                     </codeislife-unit-selector>
                </div>

                <div class="inputs-container">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.top ?? ""} 
                            @input=${(t) => this._update("top", t.target.value)}
                            type="text">
                        </uui-input>
                        <label>Top</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.right ?? ""} 
                            @input=${(t) => this._update("right", t.target.value)}
                            type="text">
                        </uui-input>
                        <label>Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottom ?? ""} 
                            @input=${(t) => this._update("bottom", t.target.value)}
                            type="text">
                        </uui-input>
                        <label>Bottom</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.left ?? ""} 
                            @input=${(t) => this._update("left", t.target.value)}
                            type="text">
                        </uui-input>
                        <label>Left</label>
                    </div>

                    <div class="link-control">
                        <uui-button 
                            compact 
                            look="${this._value.isLinked ? "primary" : "secondary"}" 
                            @click=${this._toggleLink}
                            title="${this._value.isLinked ? "Unlink values" : "Link values"}">
                            <span class="link-icon">
                                ${this._value.isLinked ? "🔗" : "🔓"}
                            </span>
                        </uui-button>
                    </div>

                </div>
            </div>
        `;
  }
};
s.styles = h`
        :host {
            display: block;
            font-family: inherit;
        }
        
        .spacing-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 400px;
        }

        .header-controls {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 24px; /* Increased height */
            margin-bottom: 2px;
            padding-right: 2px;
        }

        .unit-selector, .unit-arrow {
            display: none;
        }

        .inputs-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto; /* 4 inputs + link button */
            gap: 4px;
            align-items: start;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        uui-input {
            width: 100%;
            text-align: center;
            --uui-input-padding-left: 2px;
            --uui-input-padding-right: 2px;
            --uui-input-height: 30px; 
            min-height: 30px; /* User requested min-height */
            font-size: 12px;
        }

        .input-group label {
            font-size: 9px;
            color: #a1a1a1; /* Fixed soft gray */
            font-weight: 500;
            margin-top: 2px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .input-group:hover label {
            opacity: 1;
            color: var(--uui-color-text);
            font-weight: 700;
        }

        .link-control {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px; /* Match input height */
            padding-left: 2px;
        }

        .link-icon {
            font-size: 12px; /* Smaller icon too */
            line-height: 1;
            opacity: 0.7;
        }
        
        uui-button[look="secondary"] .link-icon {
             filter: grayscale(100%);
             opacity: 0.5;
        }
    `;
u([
  f()
], s.prototype, "_value", 2);
u([
  l({ attribute: !1 })
], s.prototype, "config", 2);
u([
  l({ attribute: !1 })
], s.prototype, "value", 1);
s = u([
  v("codeislife-spacing-editor")
], s);
const y = s;
export {
  s as CodeIsLifeSpacingEditorElement,
  n as CodeIsLifeUnitSelectorElement,
  y as default
};
