import { html as h, css as y, state as c, property as _, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as b } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as $ } from "@umbraco-cms/backoffice/lit-element";
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, v = (t) => {
  throw TypeError(t);
}, p = (t, e, s, o) => {
  for (var i = o > 1 ? void 0 : o ? C(e, s) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (i = (o ? r(e, s, i) : r(i)) || i);
  return o && i && w(e, s, i), i;
}, m = (t, e, s) => e.has(t) || v("Cannot " + s), u = (t, e, s) => (m(t, e, "read from private field"), s ? s.call(t) : e.get(t)), O = (t, e, s) => e.has(t) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), f = (t, e, s, o) => (m(t, e, "write to private field"), e.set(t, s), s), l;
let a = class extends b($, void 0) {
  constructor() {
    super(...arguments), this._options = [], this._enableFiltering = !1, O(this, l, ""), this.readonly = !1, this._filteredOptions = [], this._filterTerm = "";
  }
  set value(t) {
    f(this, l, t ?? ""), this._updateSelectedState();
  }
  get value() {
    return u(this, l);
  }
  set config(t) {
    if (!t) return;
    const e = t.getValueByAlias("options");
    this._enableFiltering = t.getValueByAlias("enableFiltering") ?? !1;
    let s = [];
    Array.isArray(e) ? s = e.map((i) => {
      const r = (typeof i == "string" ? i : i.value).split("|"), d = r[0].trim();
      return { name: r.length > 1 ? r[1].trim() : d, value: d };
    }) : typeof e == "string" && (s = e.split(`
`).map((i) => {
      const n = i.split("|"), r = n[0].trim(), d = n.length > 1 ? n[1].trim() : r;
      return r ? { name: d, value: r } : null;
    }).filter((i) => i !== null)), this._options = s.map((i) => ({
      ...i,
      selected: i.value === u(this, l)
    })), this._filterOptions();
    const o = t.getValueByAlias("defaultValue");
    !u(this, l) && o && (f(this, l, o), this._updateSelectedState());
  }
  _updateSelectedState() {
    this._options.forEach((t) => t.selected = t.value === u(this, l)), this.requestUpdate();
  }
  _filterOptions() {
    if (!this._enableFiltering || !this._filterTerm)
      this._filteredOptions = this._options;
    else {
      const t = this._filterTerm.toLowerCase();
      this._filteredOptions = this._options.filter(
        (e) => e.name.toLowerCase().includes(t) || e.value.toLowerCase().includes(t)
      );
    }
  }
  _onInput(t) {
    this._filterTerm = t.target.search || "", this._filterOptions();
  }
  _onChange(t) {
    t.stopPropagation();
    const e = t.target;
    this.value = e.value, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return this.readonly ? h`<div>${u(this, l)}</div>` : this._enableFiltering ? h`
                <uui-combobox 
                    .value="${u(this, l)}"
                    @change="${this._onChange}"
                    @input="${this._onInput}"
                    style="width: 100%;">
                    <uui-combobox-list>
                        ${this._filteredOptions.map((t) => h`
                            <uui-combobox-list-option .value="${t.value}" .displayValue="${t.name}">
                                ${t.name}
                            </uui-combobox-list-option>
                        `)}
                    </uui-combobox-list>
                </uui-combobox>
            ` : h`
                <uui-select
                    .value="${u(this, l)}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    ${this._options.map((t) => h`
                        <uui-select-option .value="${t.value}" .label="${t.name}" ?selected="${t.selected}">
                            ${t.name}
                        </uui-select-option>
                    `)}
                </uui-select>
            `;
  }
};
l = /* @__PURE__ */ new WeakMap();
a.styles = y`
        :host {
            display: block;
        }
    `;
p([
  c()
], a.prototype, "_options", 2);
p([
  c()
], a.prototype, "_enableFiltering", 2);
p([
  _({ type: String })
], a.prototype, "value", 1);
p([
  _({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
p([
  c()
], a.prototype, "_filteredOptions", 2);
p([
  _({ attribute: !1 })
], a.prototype, "config", 1);
a = p([
  g("advanced-dropdown-editor")
], a);
const F = a;
export {
  a as AdvancedDropdownEditorElement,
  F as default
};
