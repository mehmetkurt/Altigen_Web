import { html as c, css as y, state as _, property as h, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin as b } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement as $ } from "@umbraco-cms/backoffice/lit-element";
var w = Object.defineProperty, E = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, p = (e, t, s, o) => {
  for (var a = o > 1 ? void 0 : o ? E(t, s) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (a = (o ? i(t, s, a) : i(a)) || a);
  return o && a && w(t, s, a), a;
}, f = (e, t, s) => t.has(e) || m("Cannot " + s), u = (e, t, s) => (f(e, t, "read from private field"), s ? s.call(e) : t.get(e)), x = (e, t, s) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), v = (e, t, s, o) => (f(e, t, "write to private field"), t.set(e, s), s), l;
let r = class extends b($, void 0) {
  constructor() {
    super(...arguments), this._options = [], this._enableFiltering = !1, x(this, l, ""), this.readonly = !1;
  }
  set value(e) {
    v(this, l, e ?? ""), this._updateSelectedState();
  }
  get value() {
    return u(this, l);
  }
  set config(e) {
    if (!e) return;
    const t = e.getValueByAlias("options");
    this._enableFiltering = e.getValueByAlias("enableFiltering") ?? !1;
    let s = [];
    Array.isArray(t) ? s = t.map((a) => {
      const i = (typeof a == "string" ? a : a.value).split("|"), d = i[0].trim();
      return { name: i.length > 1 ? i[1].trim() : d, value: d };
    }) : typeof t == "string" && (s = t.split(`
`).map((a) => {
      const n = a.split("|"), i = n[0].trim(), d = n.length > 1 ? n[1].trim() : i;
      return i ? { name: d, value: i } : null;
    }).filter((a) => a !== null)), this._options = s.map((a) => ({
      ...a,
      selected: a.value === u(this, l)
    }));
    const o = e.getValueByAlias("defaultValue");
    !u(this, l) && o && (v(this, l, o), this._updateSelectedState());
  }
  _updateSelectedState() {
    this._options.forEach((e) => e.selected = e.value === u(this, l)), this.requestUpdate();
  }
  _onChange(e) {
    e.stopPropagation();
    const t = e.target;
    this.value = t.value, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0 }));
  }
  render() {
    return this.readonly ? c`<div>${u(this, l)}</div>` : this._enableFiltering ? c`
                <uui-combobox 
                    .value="${u(this, l)}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    <uui-combobox-list>
                        ${this._options.map((e) => c`
                            <uui-combobox-list-option .value="${e.value}" .displayValue="${e.name}">
                                ${e.name}
                            </uui-combobox-list-option>
                        `)}
                    </uui-combobox-list>
                </uui-combobox>
            ` : c`
                <uui-select
                    .value="${u(this, l)}"
                    @change="${this._onChange}"
                    style="width: 100%;">
                    ${this._options.map((e) => c`
                        <uui-select-option .value="${e.value}" .label="${e.name}" ?selected="${e.selected}">
                            ${e.name}
                        </uui-select-option>
                    `)}
                </uui-select>
            `;
  }
};
l = /* @__PURE__ */ new WeakMap();
r.styles = y`
        :host {
            display: block;
        }
    `;
p([
  _()
], r.prototype, "_options", 2);
p([
  _()
], r.prototype, "_enableFiltering", 2);
p([
  h({ type: String })
], r.prototype, "value", 1);
p([
  h({ type: Boolean, reflect: !0 })
], r.prototype, "readonly", 2);
p([
  h({ attribute: !1 })
], r.prototype, "config", 1);
r = p([
  g("advanced-dropdown-editor")
], r);
const V = r;
export {
  r as AdvancedDropdownEditorElement,
  V as default
};
