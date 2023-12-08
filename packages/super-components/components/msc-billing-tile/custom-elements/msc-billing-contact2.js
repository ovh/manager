import { proxyCustomElement, HTMLElement, h, Fragment, Host } from '@stencil/core/internal/client';
import { O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE } from './ods-theme-typography-size2.js';
import { d as defineCustomElement$1 } from './osds-text2.js';
import { O as OdsHTMLAnchorElementTarget, a as ODS_ICON_NAME } from './icon-name.js';
import { O as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { O as ODS_ICON_SIZE, d as defineCustomElement$4 } from './osds-icon2.js';
import { d as defineCustomElement$7 } from './menu-custom2.js';
import { d as defineCustomElement$6 } from './osds-button2.js';
import { d as defineCustomElement$5 } from './osds-divider2.js';
import { d as defineCustomElement$3 } from './osds-link2.js';
import { d as defineCustomElement$2 } from './osds-skeleton2.js';
import { a as apiClient } from './client.js';

const mscBillingContactCss = ".tile-title{display:block;margin-bottom:var(--ods-size-03)}.link-text{margin-right:var(--ods-size-04)}.new-link-icon{display:inline list-item;margin-left:var(--ods-size-04)}";

const MscBillingContact = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async componentWillLoad() {
    var _a;
    if (this.isDomainServiceType()) {
      this.domainProperties = await apiClient.v6
        .get(`/domain/${this.serviceName}`)
        .then((response) => response.data);
      this.ownerInfos = await apiClient.v6
        .get(`/domain/contact/${(_a = this.domainProperties) === null || _a === void 0 ? void 0 : _a.whoisOwner}`)
        .then((response) => response.data);
    }
  }
  isDomainServiceType() {
    return this.serviceType === 'DOMAIN';
  }
  isOwnerChangeableServiceType() {
    return [
      'DOMAIN',
      'HOSTING_WEB',
      'HOSTING_PRIVATEDATABASE',
      'DEDICATED_SERVER',
      'DEDICATED_HOUSING',
      'VPS',
      'EMAIL_DOMAIN',
      'VRACK',
      'DEDICATEDCLOUD', // VMWare
    ].includes(this.serviceType);
  }
  getDomainOwnerFullname() {
    var _a, _b;
    return `${(_a = this.ownerInfos) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = this.ownerInfos) === null || _b === void 0 ? void 0 : _b.lastName}`;
  }
  getMenuLinks() {
    var _a, _b, _c, _d, _e;
    return (h(Fragment, null, h("osds-link", { "data-tracking": this.subscriptionManagementDataTracking, href: (_a = this.urls) === null || _a === void 0 ? void 0 : _a.contactManagementUrl, color: ODS_THEME_COLOR_INTENT.primary, target: OdsHTMLAnchorElementTarget._blank }, this.localeStrings.manager_billing_subscription_contacts_management, h("osds-icon", { slot: "end", class: "new-link-icon", size: ODS_ICON_SIZE.xxs, name: ODS_ICON_NAME.ARROW_RIGHT, color: ODS_THEME_COLOR_INTENT.primary })), this.isOwnerChangeableServiceType() && (h("osds-link", { "data-tracking": this.changeOwnerDataTracking, href: this.isDomainServiceType()
        ? (_b = this.urls) === null || _b === void 0 ? void 0 : _b.changeDomainOwnerUrl
        : (_c = this.urls) === null || _c === void 0 ? void 0 : _c.changeOwnerUrl, target: OdsHTMLAnchorElementTarget._blank, color: ODS_THEME_COLOR_INTENT.primary }, h("span", { class: "link-text" }, this.localeStrings.billing_services_actions_menu_change_owner), h("osds-icon", { slot: "end", class: "new-link-icon", size: ODS_ICON_SIZE.xxs, name: ODS_ICON_NAME.EXTERNAL_LINK, color: ODS_THEME_COLOR_INTENT.primary }))), this.isDomainServiceType() && ((_d = this.domainProperties) === null || _d === void 0 ? void 0 : _d.whoisOwner) && (h("osds-link", { "data-tracking": this.updateOwnerDataTracking, href: (_e = this.urls) === null || _e === void 0 ? void 0 : _e.updateOwnerUrl.replace('{ownerId}', this.domainProperties.whoisOwner), color: ODS_THEME_COLOR_INTENT.primary, target: OdsHTMLAnchorElementTarget._blank }, this.localeStrings
      .billing_services_actions_menu_configuration_update_owner))));
  }
  render() {
    return (h(Host, null, h("osds-divider", { separator: true }), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.text }, this.localeStrings.manager_billing_subscription_contacts), h("div", null, h("menu-custom", null, this.getMenuLinks()), !this.serviceInfos ? (h("osds-skeleton", null)) : (h("osds-text", { level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200 }, [
      `${this.serviceInfos.contactAdmin} ${this.localeStrings.manager_billing_subscription_contacts_admin}`,
      `${this.serviceInfos.contactBilling} ${this.localeStrings.manager_billing_subscription_contacts_billing}`,
      `${this.serviceInfos.contactTech} ${this.localeStrings.manager_billing_subscription_contacts_tech}`,
      this.isDomainServiceType() &&
        `${this.getDomainOwnerFullname()}: ${this.localeStrings.billing_services_domain_contact_owner}`,
    ]
      .filter(Boolean)
      .map((contact) => (h("div", { key: contact }, contact))))))));
  }
  get host() { return this; }
  static get style() { return mscBillingContactCss; }
}, [1, "msc-billing-contact", {
    "serviceName": [1, "service-name"],
    "serviceType": [1, "service-type"],
    "serviceInfos": [16],
    "changeOwnerDataTracking": [1, "change-owner-data-tracking"],
    "updateOwnerDataTracking": [1, "update-owner-data-tracking"],
    "subscriptionManagementDataTracking": [1, "subscription-management-data-tracking"],
    "localeStrings": [16],
    "urls": [16],
    "domainProperties": [32],
    "ownerInfos": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-billing-contact", "menu-custom", "osds-button", "osds-divider", "osds-icon", "osds-link", "osds-skeleton", "osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-billing-contact":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscBillingContact);
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

export { MscBillingContact as M, defineCustomElement as d };
