import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { a as ODS_BUTTON_TYPE, b as ODS_BUTTON_VARIANT, d as defineCustomElement$2 } from './osds-button2.js';
import { d as defineCustomElement$1 } from './osds-icon2.js';

const menuCustomCss = ".menu{position:absolute;display:flex;flex-direction:column;right:var(--ods-size-04);align-items:flex-end;top:50%}.menu .triangle{position:absolute;right:0;top:var(--ods-size-n-05);display:inline-block;height:0;width:0;border-right:9px solid transparent;border-bottom:var(--ods-size-05) solid var(--ods-color-gray-000);border-left:9px solid transparent;margin-right:7px}.menu .tooltip{position:relative;filter:drop-shadow(0px 0px 5px var(--ods-color-gray-100));border-radius:var(--ods-size-border-radius-02);border:1px solid var(--ods-color-gray-000);background-color:var(--ods-color-gray-000);z-index:1;padding:var(--ods-size-03) var(--ods-size-06);display:none;row-gap:var(--ods-size-03);white-space:nowrap;margin-top:var(--ods-size-05)}.menu .tooltip.visible{display:grid}";

const MenuCustom = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.showTooltip = false;
    this.openMenu = (event) => {
      if (!this.showTooltip) {
        this.showTooltip = true;
        setTimeout(() => document.addEventListener('click', this.closeMenu));
      }
      else {
        this.closeMenu(event);
      }
    };
    this.closeMenu = (event) => {
      var _a, _b;
      if (!((_b = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.tooltip')) === null || _b === void 0 ? void 0 : _b.contains(event.target))) {
        this.showTooltip = false;
        document.removeEventListener('click', this.closeMenu);
      }
    };
  }
  render() {
    return (h(Host, null, h("div", { class: "menu" }, h("osds-button", { onClick: this.openMenu, type: ODS_BUTTON_TYPE.button, variant: ODS_BUTTON_VARIANT.stroked, color: ODS_THEME_COLOR_INTENT.primary, circle: true }, h("osds-icon", { name: "ellipsis", size: "xs", color: ODS_THEME_COLOR_INTENT.primary })), h("div", { class: `tooltip${this.showTooltip ? ' visible' : ''}` }, h("div", { class: "triangle" }), h("slot", null)))));
  }
  get host() { return this; }
  static get style() { return menuCustomCss; }
}, [1, "menu-custom", {
    "showTooltip": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["menu-custom", "osds-button", "osds-icon"];
  components.forEach(tagName => { switch (tagName) {
    case "menu-custom":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MenuCustom);
      }
      break;
    case "osds-button":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
    case "osds-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { MenuCustom as M, defineCustomElement as d };
