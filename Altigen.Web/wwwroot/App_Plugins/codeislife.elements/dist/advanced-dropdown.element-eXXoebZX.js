import { LitElement as h, html as u, css as m, state as p, property as c, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as d } from "@umbraco-cms/backoffice/element-api";
import { UmbFormControlMixin as _ } from "@umbraco-cms/backoffice/validation";
var b = Object.defineProperty, f = Object.getOwnPropertyDescriptor, a = (t, e, n, s) => {
  for (var o = s > 1 ? void 0 : s ? f(e, n) : e, l = t.length - 1, r; l >= 0; l--)
    (r = t[l]) && (o = (s ? r(e, n, o) : r(o)) || o);
  return s && o && b(e, n, o), o;
};
let i = class extends _(d(h), "") {
  constructor() {
    super(...arguments), this._value = "", this._options = [];
  }
  set value(t) {
    this._value = t;
  }
  get value() {
    return this._value;
  }
  connectedCallback() {
    super.connectedCallback(), this._parseOptions(), this._setDefaultValue();
  }
  _parseOptions() {
    var e;
    if (!((e = this.config) != null && e.options)) return;
    const t = this.config.options.split(`
`);
    this._options = t.map((n) => {
      const s = n.split("|"), o = s[0].trim(), l = s.length > 1 ? s[1].trim() : o;
      return o ? { name: l, value: o } : null;
    }).filter((n) => n !== null);
  }
  _setDefaultValue() {
    var t;
    !this._value && ((t = this.config) != null && t.defaultValue) && (this._value = this.config.defaultValue, this._dispatchChange());
  }
  _onChange(t) {
    const e = t.target;
    this.value = e.value, this._dispatchChange();
  }
  _dispatchChange() {
    this.dispatchEvent(new CustomEvent("property-value-change", { bubbles: !0, composed: !0 })), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 }));
  }
  render() {
    var t;
    return (t = this.config) != null && t.enableFiltering ? u`
                <uui-combobox 
                    .value="${this._value}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    <uui-combobox-list>
                        ${this._options.map((e) => u`
                            <uui-combobox-list-option .value="${e.value}" .displayValue="${e.name}">
                                ${e.name}
                            </uui-combobox-list-option>
                        `)}
                    </uui-combobox-list>
                </uui-combobox>
            ` : u`
                <uui-select
                    .value="${this._value}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    ${this._options.map((e) => u`
                        <uui-select-option .value="${e.value}" .label="${e.name}">
                            ${e.name}
                        </uui-select-option>
                    `)}
                </uui-select>
            `;
  }
};
i.styles = m`
        :host {
            display: block;
        }
    `;
a([
  p()
], i.prototype, "_value", 2);
a([
  c({ type: String })
], i.prototype, "value", 1);
a([
  c({ attribute: !1 })
], i.prototype, "config", 2);
a([
  p()
], i.prototype, "_options", 2);
i = a([
  v("advanced-dropdown-editor")
], i);
const $ = i;
export {
  i as AdvancedDropdownEditorElement,
  $ as default
};
