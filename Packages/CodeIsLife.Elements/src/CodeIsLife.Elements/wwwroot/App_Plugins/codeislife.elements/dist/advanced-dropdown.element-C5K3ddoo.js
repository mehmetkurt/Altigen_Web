import { html as h, css as y, state as d, property as _, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as b } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as $ } from "@umbraco-cms/backoffice/lit-element";
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, v = (e) => {
  throw TypeError(e);
}, p = (e, t, s, o) => {
  for (var i = o > 1 ? void 0 : o ? C(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (o ? r(t, s, i) : r(i)) || i);
  return o && i && w(t, s, i), i;
}, m = (e, t, s) => t.has(e) || v("Cannot " + s), u = (e, t, s) => (m(e, t, "read from private field"), s ? s.call(e) : t.get(e)), O = (e, t, s) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), f = (e, t, s, o) => (m(e, t, "write to private field"), t.set(e, s), s), a;
let l = class extends b($, void 0) {
  constructor() {
    super(...arguments), this._options = [], this._enableFiltering = !1, O(this, a, ""), this.readonly = !1, this._filteredOptions = [], this._filterTerm = "";
  }
  set value(e) {
    f(this, a, e ?? ""), this._updateSelectedState();
  }
  get value() {
    return u(this, a);
  }
  set config(e) {
    if (!e) return;
    const t = e.getValueByAlias("options");
    this._enableFiltering = e.getValueByAlias("enableFiltering") ?? !1;
    let s = [];
    Array.isArray(t) ? s = t.map((i) => {
      const r = (typeof i == "string" ? i : i.value).split("|"), c = r[0].trim();
      return { name: r.length > 1 ? r[1].trim() : c, value: c };
    }) : typeof t == "string" && (s = t.split(`
`).map((i) => {
      const n = i.split("|"), r = n[0].trim(), c = n.length > 1 ? n[1].trim() : r;
      return r ? { name: c, value: r } : null;
    }).filter((i) => i !== null)), this._options = s.map((i) => ({
      ...i,
      selected: i.value === u(this, a)
    })), this._filterOptions();
    const o = e.getValueByAlias("defaultValue");
    !u(this, a) && o && (f(this, a, o), this._updateSelectedState());
  }
  _updateSelectedState() {
    this._options.forEach((e) => e.selected = e.value === u(this, a)), this.requestUpdate();
  }
  _filterOptions() {
    if (!this._enableFiltering || !this._filterTerm)
      this._filteredOptions = this._options;
    else {
      const e = this._filterTerm.toLowerCase();
      this._filteredOptions = this._options.filter(
        (t) => t.name.toLowerCase().includes(e) || t.value.toLowerCase().includes(e)
      );
    }
  }
  _onSearch(e) {
    this._filterTerm = e.target.search || "", this._filterOptions();
  }
  _onChange(e) {
    e.stopPropagation();
    const t = e.target;
    this.value = t.value, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return this.readonly ? h`<div>${u(this, a)}</div>` : this._enableFiltering ? h`
                <uui-combobox 
                    .value="${u(this, a)}"
                    @change="${this._onChange}"
                    @search="${this._onSearch}"
                    style="width: 100%;">
                    <uui-combobox-list>
                        ${this._filteredOptions.map((e) => h`
                            <uui-combobox-list-option .value="${e.value}" .displayValue="${e.name}">
                                ${e.name}
                            </uui-combobox-list-option>
                        `)}
                    </uui-combobox-list>
                </uui-combobox>
            ` : h`
                <uui-select
                    .value="${u(this, a)}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    ${this._options.map((e) => h`
                        <uui-select-option .value="${e.value}" .label="${e.name}" ?selected="${e.selected}">
                            ${e.name}
                        </uui-select-option>
                    `)}
                </uui-select>
            `;
  }
};
a = /* @__PURE__ */ new WeakMap();
l.styles = y`
        :host {
            display: block;
        }
    `;
p([
  d()
], l.prototype, "_options", 2);
p([
  d()
], l.prototype, "_enableFiltering", 2);
p([
  _({ type: String })
], l.prototype, "value", 1);
p([
  _({ type: Boolean, reflect: !0 })
], l.prototype, "readonly", 2);
p([
  d()
], l.prototype, "_filteredOptions", 2);
p([
  _({ attribute: !1 })
], l.prototype, "config", 1);
l = p([
  g("advanced-dropdown-editor")
], l);
const F = l;
export {
  l as AdvancedDropdownEditorElement,
  F as default
};
