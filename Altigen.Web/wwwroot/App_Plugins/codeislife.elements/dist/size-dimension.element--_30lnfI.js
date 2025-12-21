import { LitElement as r, html as h, css as c, state as d, property as o, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
import "./unit-selector.element-VSuXczPN.js";
var f = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, l = (e, t, i, n) => {
  for (var u = n > 1 ? void 0 : n ? _(t, i) : t, a = e.length - 1, p; a >= 0; a--)
    (p = e[a]) && (u = (n ? p(t, i, u) : p(u)) || u);
  return n && u && f(t, i, u), u;
};
let s = class extends g(r) {
  constructor() {
    super(...arguments), this._value = { unit: "px", isLinked: !0 };
  }
  set value(e) {
    if (!e) {
      this._value = { unit: "px", isLinked: !0 };
      return;
    }
    if (typeof e == "object") {
      this._value = { unit: "px", isLinked: !0, ...e };
      return;
    }
    try {
      const t = JSON.parse(e);
      this._value = {
        unit: "px",
        isLinked: !0,
        ...t
      };
    } catch {
      this._value = { unit: "px", isLinked: !0 };
    }
  }
  get value() {
    return this._value;
  }
  _update(e, t) {
    let i = t;
    this._value.unit !== "custom" && !/^-?[0-9]*[.,]?[0-9]*$/.test(t) && t !== "" && (i = t.replace(/[^0-9.,-]/g, "")), this._value.isLinked ? this._value = {
      ...this._value,
      top: i,
      right: i,
      bottom: i,
      left: i
    } : this._value = { ...this._value, [e]: i }, this._dispatchChange(), this.requestUpdate();
  }
  _toggleLink() {
    if (this._value = { ...this._value, isLinked: !this._value.isLinked }, this._value.isLinked) {
      const e = this._value.top || this._value.right || this._value.bottom || this._value.left || "";
      this._value = {
        ...this._value,
        top: e,
        right: e,
        bottom: e,
        left: e
      }, this._dispatchChange();
    } else
      this.requestUpdate();
  }
  _dispatchChange() {
    this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 }));
  }
  render() {
    const e = this._value.unit === "custom" ? "text" : "number";
    return h`
            <div class="size-dimension-wrapper">
                
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
                            type="${e}">
                        </uui-input>
                        <label>Top</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.right ?? ""} 
                            @input=${(t) => this._update("right", t.target.value)}
                            type="${e}">
                        </uui-input>
                        <label>Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottom ?? ""} 
                            @input=${(t) => this._update("bottom", t.target.value)}
                            type="${e}">
                        </uui-input>
                        <label>Bottom</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.left ?? ""} 
                            @input=${(t) => this._update("left", t.target.value)}
                            type="${e}">
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
s.styles = c`
        :host {
            display: block;
            font-family: inherit;
        }
        
        .size-dimension-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 400px;
        }

        .header-controls {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 24px;
            margin-bottom: 2px;
            padding-right: 2px;
        }

        .unit-selector, .unit-arrow {
            display: none;
        }

        .inputs-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto;
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
            min-height: 30px;
            font-size: 12px;
        }

        .input-group label {
            font-size: 9px;
            color: #a1a1a1;
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
            height: 30px;
            padding-left: 2px;
        }

        .link-icon {
            font-size: 12px;
            line-height: 1;
            opacity: 0.7;
        }
        
        uui-button[look="secondary"] .link-icon {
             filter: grayscale(100%);
             opacity: 0.5;
        }
    `;
l([
  d()
], s.prototype, "_value", 2);
l([
  o({ attribute: !1 })
], s.prototype, "config", 2);
l([
  o({ attribute: !1 })
], s.prototype, "value", 1);
s = l([
  v("codeislife-size-dimension")
], s);
const b = s;
export {
  s as CodeIsLifeSizeDimensionElement,
  b as default
};
