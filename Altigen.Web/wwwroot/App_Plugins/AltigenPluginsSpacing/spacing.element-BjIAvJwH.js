import { LitElement as r, html as c, css as d, state as h, property as p, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
var _ = Object.defineProperty, m = Object.getOwnPropertyDescriptor, s = (t, e, u, a) => {
  for (var i = a > 1 ? void 0 : a ? m(e, u) : e, l = t.length - 1, o; l >= 0; l--)
    (o = t[l]) && (i = (a ? o(e, u, i) : o(i)) || i);
  return a && i && _(e, u, i), i;
};
let n = class extends g(r) {
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
                     <span class="label">Values</span>
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
n.styles = d`
        :host {
            display: block;
            font-family: inherit;
        }
        
        .spacing-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 400px;
        }

        .header-controls {
            display: flex;
            justify-content: flex-end; /* Elementor style: unit on right */
            align-items: center;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .unit-selector select {
            background: transparent;
            border: none;
            color: var(--uui-color-text-alt);
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 3px;
        }
        .unit-selector select:hover {
            background: var(--uui-color-surface-emphasis);
        }

        .inputs-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto; /* 4 inputs + link button */
            gap: 2px;
            align-items: start;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }

        uui-input {
            width: 100%;
            text-align: center;
            --uui-input-padding-left: 4px;
            --uui-input-padding-right: 4px;
        }
        
        /* Visually hide input border to match "seamless" look if desired, 
           but for Umbraco standard UI, keeping standard input style is validating. 
           Let's just make it compact. */

        .input-group label {
            font-size: 10px;
            color: var(--uui-color-text-alt);
            text-transform: uppercase;
        }

        .link-control {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px; /* Match input height approx */
            padding-left: 4px;
        }

        .link-icon {
            font-size: 14px;
            line-height: 1;
        }
    `;
s([
  h()
], n.prototype, "_value", 2);
s([
  p({ attribute: !1 })
], n.prototype, "config", 2);
s([
  p({ type: String })
], n.prototype, "value", 1);
n = s([
  v("altigen-spacing-editor")
], n);
const b = n;
export {
  n as AltigenSpacingEditorElement,
  b as default
};
//# sourceMappingURL=spacing.element-BjIAvJwH.js.map
