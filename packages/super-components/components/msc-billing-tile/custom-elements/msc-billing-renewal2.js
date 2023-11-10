import { proxyCustomElement, HTMLElement, h, Fragment } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT, O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE } from './ods-theme-typography-size.js';
import { O as OdsHTMLAnchorElementTarget } from './ods-html-anchor-element-target.js';
import { O as ODS_ICON_NAME } from './icon-name.js';
import { O as ODS_ICON_SIZE, d as defineCustomElement$4 } from './osds-icon2.js';
import { d as defineCustomElement$1 } from './osds-text2.js';
import { O as ODS_CHIP_SIZE, a as ODS_CHIP_VARIANT, d as defineCustomElement$6 } from './osds-chip2.js';
import { d as defineCustomElement$8 } from './menu-custom2.js';
import { d as defineCustomElement$7 } from './osds-button2.js';
import { d as defineCustomElement$5 } from './osds-divider2.js';
import { d as defineCustomElement$3 } from './osds-link2.js';
import { d as defineCustomElement$2 } from './osds-skeleton2.js';

var RenewalStatus;
(function (RenewalStatus) {
  RenewalStatus["DELETE_AT_EXPIRATION"] = "deleteAtExpiration";
  RenewalStatus["AUTOMATIC"] = "automatic";
  RenewalStatus["AUTO"] = "auto";
  RenewalStatus["MANUAL"] = "manualPayment";
  RenewalStatus["EXPIRED"] = "expired";
  RenewalStatus["MANUAL_FORCED"] = "forcedManual";
  RenewalStatus["BILLING_SUSPENDED"] = "billingSuspended";
  RenewalStatus["UNKNOWN"] = "unknown";
})(RenewalStatus || (RenewalStatus = {}));

const mscBillingRenewalCss = ".tile-title{display:block;margin-bottom:var(--ods-size-03)}.next-billing-date-label{display:block;margin-bottom:var(--ods-size-03)}.link-text{margin-right:var(--ods-size-04)}.new-link-icon{display:inline list-item;margin-left:var(--ods-size-04)}";

const chipColorMap = {
  [RenewalStatus.AUTOMATIC]: ODS_THEME_COLOR_INTENT.success,
  [RenewalStatus.AUTO]: ODS_THEME_COLOR_INTENT.success,
  [RenewalStatus.MANUAL]: ODS_THEME_COLOR_INTENT.warning,
  [RenewalStatus.BILLING_SUSPENDED]: ODS_THEME_COLOR_INTENT.info,
  [RenewalStatus.MANUAL_FORCED]: ODS_THEME_COLOR_INTENT.info,
  [RenewalStatus.DELETE_AT_EXPIRATION]: ODS_THEME_COLOR_INTENT.error,
  [RenewalStatus.EXPIRED]: ODS_THEME_COLOR_INTENT.error,
  [RenewalStatus.UNKNOWN]: ODS_THEME_COLOR_INTENT.error,
};
const MscBillingRenewal = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  getRenewStatus() {
    var _a, _b, _c, _d;
    if (((_a = this.serviceInfos) === null || _a === void 0 ? void 0 : _a.status) === 'ok') {
      if (this.serviceInfos.renew.deleteAtExpiration) {
        // Red chip 'Cancellation requested', link in menu 'Stop cancellation of service'
        return RenewalStatus.DELETE_AT_EXPIRATION;
      }
      // service still active
      if (this.serviceInfos.renew.automatic) {
        // Green chip 'Automatic renewal', link in menu 'Manage my commitment' and 'Cancel subscription'
        return RenewalStatus.AUTOMATIC;
      }
      if (this.serviceInfos.renew.manualPayment) {
        // Yellow chip 'Manual renewal'
        return RenewalStatus.MANUAL;
      }
      if (this.serviceInfos.renew.forced) {
        return RenewalStatus.MANUAL_FORCED;
      }
    }
    if (((_b = this.serviceInfos) === null || _b === void 0 ? void 0 : _b.status) === 'expired') {
      // Red chip 'expired', link in menu 'Renew service'
      return RenewalStatus.EXPIRED;
    }
    if (((_d = (_c = this.serviceDetails) === null || _c === void 0 ? void 0 : _c.ressource) === null || _d === void 0 ? void 0 : _d.state) === 'suspended') {
      return RenewalStatus.BILLING_SUSPENDED;
    }
    return RenewalStatus.UNKNOWN;
  }
  getMenuLink() {
    var _a, _b, _c, _d, _e;
    switch (this.getRenewStatus()) {
      case RenewalStatus.EXPIRED:
        return (h("osds-link", { "data-tracking": this.renewLinkDataTracking, color: ODS_THEME_COLOR_INTENT.primary, href: (_a = this.urls) === null || _a === void 0 ? void 0 : _a.renewUrl, target: OdsHTMLAnchorElementTarget._blank }, this.localeStrings.billing_services_actions_menu_renew, h("osds-icon", { class: "new-link-icon", size: ODS_ICON_SIZE.xxs, name: ODS_ICON_NAME.EXTERNAL_LINK, color: ODS_THEME_COLOR_INTENT.primary })));
      case RenewalStatus.DELETE_AT_EXPIRATION:
        return (h("osds-link", { "data-tracking": this.cancelResiliationDataTracking, target: OdsHTMLAnchorElementTarget._blank, color: ODS_THEME_COLOR_INTENT.primary, href: (_b = this.urls) === null || _b === void 0 ? void 0 : _b.cancelResiliationUrl }, this.localeStrings.billing_services_actions_menu_resiliate_cancel));
      default:
        return (h(Fragment, null, h("osds-link", { "data-tracking": this.manageRenewDataTracking, target: OdsHTMLAnchorElementTarget._blank, href: (_c = this.urls) === null || _c === void 0 ? void 0 : _c.manageRenewUrl, color: ODS_THEME_COLOR_INTENT.primary }, this.localeStrings.billing_services_actions_menu_manage_renew), h("osds-link", { "data-tracking": this.anticipateRenewDataTracking, target: OdsHTMLAnchorElementTarget._blank, href: (_d = this.urls) === null || _d === void 0 ? void 0 : _d.anticipateRenew, color: ODS_THEME_COLOR_INTENT.primary }, this.localeStrings
          .billing_services_actions_menu_anticipate_renew), h("osds-link", { "data-tracking": this.resiliateDataTracking, target: OdsHTMLAnchorElementTarget._blank, href: (_e = this.urls) === null || _e === void 0 ? void 0 : _e.resiliateUrl, color: ODS_THEME_COLOR_INTENT.primary }, this.localeStrings.billing_services_actions_menu_resiliate)));
    }
  }
  render() {
    const renewStatus = this.getRenewStatus();
    const chipColor = chipColorMap[renewStatus] || ODS_THEME_COLOR_INTENT.default;
    const chipTextMap = {
      [RenewalStatus.DELETE_AT_EXPIRATION]: this.localeStrings
        .manager_billing_service_status_delete_at_expiration,
      [RenewalStatus.AUTO]: this.localeStrings
        .manager_billing_service_status_auto,
      [RenewalStatus.AUTOMATIC]: this.localeStrings
        .manager_billing_service_status_automatic,
      [RenewalStatus.MANUAL]: this.localeStrings
        .manager_billing_service_status_manualPayment,
      [RenewalStatus.EXPIRED]: this.localeStrings
        .manager_billing_service_status_expired,
      [RenewalStatus.MANUAL_FORCED]: this.localeStrings
        .manager_billing_service_status_forced_manual,
      [RenewalStatus.BILLING_SUSPENDED]: this.localeStrings
        .manager_billing_service_status_billing_suspended,
      [RenewalStatus.UNKNOWN]: '',
    };
    const chipText = chipTextMap[renewStatus] ||
      this.localeStrings[`manager_billing_service_status_${renewStatus}`];
    return (h(Fragment, null, h("osds-divider", { separator: true }), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.text }, this.localeStrings.manager_billing_subscription_next_due_date), !this.serviceInfos ? (h("osds-skeleton", null)) : (h(Fragment, null, h("div", null, h("menu-custom", null, this.getMenuLink())), h("osds-text", { class: "next-billing-date-label", level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.default }, this.nextBillingDate), h("osds-chip", { color: chipColor, size: ODS_CHIP_SIZE.sm, variant: ODS_CHIP_VARIANT.flat, inline: true }, chipText)))));
  }
  static get style() { return mscBillingRenewalCss; }
}, [1, "msc-billing-renewal", {
    "renewLinkDataTracking": [1, "renew-link-data-tracking"],
    "cancelResiliationDataTracking": [1, "cancel-resiliation-data-tracking"],
    "manageRenewDataTracking": [1, "manage-renew-data-tracking"],
    "resiliateDataTracking": [1, "resiliate-data-tracking"],
    "anticipateRenewDataTracking": [1, "anticipate-renew-data-tracking"],
    "urls": [16],
    "serviceName": [1, "service-name"],
    "serviceType": [1, "service-type"],
    "servicePath": [1, "service-path"],
    "nextBillingDate": [1, "next-billing-date"],
    "serviceInfos": [16],
    "serviceDetails": [16],
    "localeStrings": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-billing-renewal", "menu-custom", "osds-button", "osds-chip", "osds-divider", "osds-icon", "osds-link", "osds-skeleton", "osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-billing-renewal":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscBillingRenewal);
      }
      break;
    case "menu-custom":
      if (!customElements.get(tagName)) {
        defineCustomElement$8();
      }
      break;
    case "osds-button":
      if (!customElements.get(tagName)) {
        defineCustomElement$7();
      }
      break;
    case "osds-chip":
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

export { MscBillingRenewal as M, RenewalStatus as R, defineCustomElement as d };
