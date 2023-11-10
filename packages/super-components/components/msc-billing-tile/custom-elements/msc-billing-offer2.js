import { proxyCustomElement, HTMLElement, h, Fragment, Host } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT, O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE } from './ods-theme-typography-size.js';
import { d as defineCustomElement$1 } from './osds-text2.js';
import { d as defineCustomElement$7 } from './menu-custom2.js';
import { d as defineCustomElement$6 } from './osds-button2.js';
import { d as defineCustomElement$5 } from './osds-divider2.js';
import { d as defineCustomElement$4 } from './osds-icon2.js';
import { d as defineCustomElement$3 } from './osds-link2.js';
import { d as defineCustomElement$2 } from './osds-skeleton2.js';
import { a as apiClient } from './client.js';

const mscBillingOfferCss = ".tile-title{display:block;margin-bottom:var(--ods-size-03)}.tile-description{display:block}";

const MscBillingOffer = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async componentWillLoad() {
    this.serviceProperties = await apiClient.v6
      .get(this.servicePath)
      .then((response) => response.data);
  }
  isUpgradableOffer() {
    var _a;
    return (this.serviceType !== 'DOMAIN' && !((_a = this.serviceDetails) === null || _a === void 0 ? void 0 : _a.parentServiceId));
  }
  getMenu() {
    var _a, _b;
    return ((_a = this.serviceProperties) === null || _a === void 0 ? void 0 : _a.offer) && !this.isUpgradableOffer() ? (h(Fragment, null)) : (h("menu-custom", null, h("osds-link", { "data-tracking": this.changeOfferDataTracking, href: (_b = this.urls) === null || _b === void 0 ? void 0 : _b.changeOfferUrl, color: ODS_THEME_COLOR_INTENT.primary }, this.localeStrings.billing_services_actions_menu_change_offer)));
  }
  render() {
    var _a;
    if (this.serviceProperties && !this.serviceProperties.offer) {
      return h(Fragment, null);
    }
    return (h(Host, null, h("osds-divider", { separator: true }), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.text }, (_a = this.localeStrings) === null || _a === void 0 ? void 0 : _a.manager_billing_subscription_offer), h("div", null, this.getMenu(), !this.serviceInfos ||
      !this.serviceProperties ||
      !this.serviceDetails ? (h("osds-skeleton", null)) : (h("osds-text", { class: "tile-description", level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.default }, this.serviceProperties.offer)))));
  }
  get host() { return this; }
  static get style() { return mscBillingOfferCss; }
}, [1, "msc-billing-offer", {
    "serviceType": [1, "service-type"],
    "servicePath": [1, "service-path"],
    "serviceInfos": [16],
    "serviceDetails": [16],
    "changeOfferDataTracking": [1, "change-offer-data-tracking"],
    "localeStrings": [16],
    "urls": [16],
    "serviceProperties": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-billing-offer", "menu-custom", "osds-button", "osds-divider", "osds-icon", "osds-link", "osds-skeleton", "osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-billing-offer":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscBillingOffer);
      }
      break;
    case "menu-custom":
      if (!customElements.get(tagName)) {
        defineCustomElement$7();
      }
      break;
    case "osds-button":
      if (!customElements.get(tagName)) {
        defineCustomElement$6();
      }
      break;
    case "osds-divider":
      if (!customElements.get(tagName)) {
        defineCustomElement$5();
      }
      break;
    case "osds-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$4();
      }
      break;
    case "osds-link":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "osds-skeleton":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
    case "osds-text":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { MscBillingOffer as M, defineCustomElement as d };
