import { LitElement as p, html as c, css as h, state as d, property as r, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
var f = Object.defineProperty, x = Object.getOwnPropertyDescriptor, o = (t, e, l, a) => {
  for (var i = a > 1 ? void 0 : a ? x(e, l) : e, u = t.length - 1, s; u >= 0; u--)
    (s = t[u]) && (i = (a ? s(e, l, i) : s(i)) || i);
  return a && i && f(e, l, i), i;
};
let n = class extends g(p) {
  constructor() {
    super(...arguments), this._value = { unit: "px", isLinked: !0 };
  }
  set value(t) {
    if (!t) {
      this._value = { unit: "px", isLinked: !0 };
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
    return JSON.stringify(this._value);
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
  _changeUnit(t) {
    const e = t.target;
    this._value = { ...this._value, unit: e.value }, this._dispatchChange();
  }
  _dispatchChange() {
    this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return c`
            <div class="spacing-wrapper">
                
                <div class="header-controls">
                     <div class="unit-selector">
                        <select @change=${this._changeUnit} .value=${this._value.unit || "px"}>
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="em">em</option>
                            <option value="rem">rem</option>
                            <option value="vw">vw</option>
                            <option value="vh">vh</option>
                            <option value="">custom</option>
                        </select>
                        <span class="unit-arrow">▼</span>
                     </div>
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
n.styles = h`
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

        .unit-selector {
            position: relative;
            display: inline-flex;
            align-items: center;
            background: var(--uui-color-surface-alt);
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 0 4px;
            height: 20px;
            transition: all 0.2s;
        }
        
        .unit-selector:hover {
            border-color: var(--uui-color-border-emphasis);
            background: var(--uui-color-surface);
        }

        .unit-selector select {
            appearance: none;
            -webkit-appearance: none;
            background: transparent;
            border: none;
            color: var(--uui-color-text);
            font-size: 10px;
            text-transform: lowercase;
            font-weight: 600;
            cursor: pointer;
            padding-right: 14px; /* Space for arrow */
            height: 100%;
            line-height: 1;
        }
        
        .unit-selector select:hover, .unit-selector select:focus {
            outline: none;
        }

        .unit-arrow {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 7px;
            color: var(--uui-color-text-alt);
            pointer-events: none;
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
o([
  d()
], n.prototype, "_value", 2);
o([
  r({ attribute: !1 })
], n.prototype, "config", 2);
o([
  r({ type: String })
], n.prototype, "value", 1);
n = o([
  v("altigen-spacing-editor")
], n);
const b = n;
export {
  n as AltigenSpacingEditorElement,
  b as default
};
//# sourceMappingURL=spacing.element-BbispM2e.js.map
