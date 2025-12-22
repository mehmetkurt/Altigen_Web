import { LitElement as r, html as h, css as d, state as c, property as p, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as v } from "@umbraco-cms/backoffice/element-api";
import "./unit-selector.element-D_mw4tCZ.js";
var f = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, l = (e, t, i, s) => {
  for (var u = s > 1 ? void 0 : s ? _(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (u = (s ? o(t, i, u) : o(u)) || u);
  return s && u && f(t, i, u), u;
};
let a = class extends v(r) {
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
      topLeft: i,
      topRight: i,
      bottomRight: i,
      bottomLeft: i
    } : this._value = { ...this._value, [e]: i }, this._dispatchChange(), this.requestUpdate();
  }
  _toggleLink() {
    if (this._value = { ...this._value, isLinked: !this._value.isLinked }, this._value.isLinked) {
      const e = this._value.topLeft || this._value.topRight || this._value.bottomRight || this._value.bottomLeft || "";
      this._value = {
        ...this._value,
        topLeft: e,
        topRight: e,
        bottomRight: e,
        bottomLeft: e
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
            <div class="border-radius-wrapper">
                
                <div class="header-controls">
                    <codeislife-unit-selector
                        .value=${this._value.unit || "px"}
                        @change=${(t) => {
      t.stopPropagation(), this._value = { ...this._value, unit: t.detail.value }, this._dispatchChange();
    }}>
                     </codeislife-unit-selector>
                </div>

                <div class="inputs-container">
                    
                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.topLeft ?? ""} 
                            @input=${(t) => this._update("topLeft", t.target.value)}
                            type="${e}"
                            label="Top-Left radius">
                        </uui-input>
                        <label>Top-Left</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.topRight ?? ""} 
                            @input=${(t) => this._update("topRight", t.target.value)}
                            type="${e}"
                            label="Top-Right radius">
                        </uui-input>
                        <label>Top-Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottomRight ?? ""} 
                            @input=${(t) => this._update("bottomRight", t.target.value)}
                            type="${e}"
                            label="Bottom-Right radius">
                        </uui-input>
                        <label>Btm-Right</label>
                    </div>

                    <div class="input-group">
                        <uui-input 
                            .value=${this._value.bottomLeft ?? ""} 
                            @input=${(t) => this._update("bottomLeft", t.target.value)}
                            type="${e}"
                            label="Bottom-Left radius">
                        </uui-input>
                        <label>Btm-Left</label>
                    </div>

                    <div class="link-control">
                        <uui-button 
                            compact 
                            look="${this._value.isLinked ? "primary" : "secondary"}" 
                            @click=${this._toggleLink}
                            label="Toggle link"
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
a.styles = d`
        :host {
            display: block;
            font-family: inherit;
        }
        
        .border-radius-wrapper {
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
            white-space: nowrap;
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
  c()
], a.prototype, "_value", 2);
l([
  p({ attribute: !1 })
], a.prototype, "config", 2);
l([
  p({ attribute: !1 })
], a.prototype, "value", 1);
a = l([
  g("codeislife-border-radius")
], a);
const y = a;
export {
  a as CodeIsLifeBorderRadiusElement,
  y as default
};
