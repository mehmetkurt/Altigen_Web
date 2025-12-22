import { html as c, css as y, state as _, property as d, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as b } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as w } from "@umbraco-cms/backoffice/lit-element";
var O = Object.defineProperty, S = Object.getOwnPropertyDescriptor, v = (t) => {
  throw TypeError(t);
}, u = (t, e, i, l) => {
  for (var s = l > 1 ? void 0 : l ? S(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (l ? r(e, i, s) : r(s)) || s);
  return l && s && O(e, i, s), s;
}, m = (t, e, i) => e.has(t) || v("Cannot " + i), p = (t, e, i) => (m(t, e, "read from private field"), i ? i.call(t) : e.get(t)), C = (t, e, i) => e.has(t) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), f = (t, e, i, l) => (m(t, e, "write to private field"), e.set(t, i), i), o;
let a = class extends b(w, void 0) {
  constructor() {
    super(...arguments), this._options = [], C(this, o, ""), this.readonly = !1, this._filteredOptions = [], this._filterTerm = "";
  }
  set value(t) {
    f(this, o, t ?? ""), this._updateSelectedState();
  }
  get value() {
    return p(this, o);
  }
  set config(t) {
    if (!t) return;
    const e = t.getValueByAlias("options");
    let i = [];
    Array.isArray(e) ? i = e.map((s) => {
      const r = (typeof s == "string" ? s : s.value).split("|"), h = r[0].trim();
      return { name: r.length > 1 ? r[1].trim() : h, value: h };
    }) : typeof e == "string" && (i = e.split(`
`).map((s) => {
      const n = s.split("|"), r = n[0].trim(), h = n.length > 1 ? n[1].trim() : r;
      return r ? { name: h, value: r } : null;
    }).filter((s) => s !== null)), this._options = i.map((s) => ({
      ...s,
      selected: s.value === p(this, o)
    })), this._filterOptions();
    const l = t.getValueByAlias("defaultValue");
    !p(this, o) && l && (f(this, o, l), this._updateSelectedState());
  }
  _updateSelectedState() {
    this._options.forEach((t) => t.selected = t.value === p(this, o)), this.requestUpdate();
  }
  _filterOptions() {
    if (!this._filterTerm)
      this._filteredOptions = this._options;
    else {
      const t = this._filterTerm.toLowerCase();
      this._filteredOptions = this._options.filter(
        (e) => e.name.toLowerCase().includes(t) || e.value.toLowerCase().includes(t)
      );
    }
  }
  _onSearch(t) {
    this._filterTerm = t.target.search || "", this._filterOptions();
  }
  _onChange(t) {
    t.stopPropagation();
    const e = t.target;
    this.value = e.value, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return this.readonly ? c`<div>${p(this, o)}</div>` : c`
            <uui-combobox 
                .value="${p(this, o)}"
                @change="${this._onChange}"
                @search="${this._onSearch}"
                style="width: 100%;"
                label="Select option">
                <uui-combobox-list>
                    ${this._filteredOptions.map((t) => c`
                        <uui-combobox-list-option .value="${t.value}" .displayValue="${t.name}">
                            ${t.name}
                        </uui-combobox-list-option>
                    `)}
                </uui-combobox-list>
            </uui-combobox>
        `;
  }
};
o = /* @__PURE__ */ new WeakMap();
a.styles = y`
        :host {
            display: block;
        }
    `;
u([
  _()
], a.prototype, "_options", 2);
u([
  d({ type: String })
], a.prototype, "value", 1);
u([
  d({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
u([
  _()
], a.prototype, "_filteredOptions", 2);
u([
  d({ attribute: !1 })
], a.prototype, "config", 1);
a = u([
  g("advanced-dropdown-editor")
], a);
const P = a;
export {
  a as AdvancedDropdownEditorElement,
  P as default
};
