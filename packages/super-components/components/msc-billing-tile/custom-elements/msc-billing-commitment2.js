import { proxyCustomElement, HTMLElement, h, Host, Fragment } from '@stencil/core/internal/client';
import { O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE, b as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { O as OdsHTMLAnchorElementTarget } from './ods-html-anchor-element-target.js';
import { d as defineCustomElement$1 } from './osds-text2.js';
import { O as ODS_CHIP_SIZE, a as ODS_CHIP_VARIANT, d as defineCustomElement$6 } from './osds-chip2.js';
import { O as ODS_ICON_NAME } from './icon-name.js';
import { O as ODS_ICON_SIZE, d as defineCustomElement$4 } from './osds-icon2.js';
import { d as defineCustomElement$5 } from './osds-divider2.js';
import { d as defineCustomElement$3 } from './osds-link2.js';
import { d as defineCustomElement$2 } from './osds-skeleton2.js';

/**
 * Format date string
 */
function formatDate(dateString, locale) {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale?.replace('_', '-'), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const defaultLocale = 'fr-FR';
/**
 * Get translations with variables
 */
function translate(localeStrings, key, options) {
    const baseTranslation = localeStrings[key] ?? '';
    return !options
        ? baseTranslation
        : Object.entries(options).reduce((translation, [optionPlaceholder, optionValue]) => translation.replace(new RegExp(`{{\\s*${optionPlaceholder}\\s*}}`, 'g'), optionValue), baseTranslation);
}

const mscBillingCommitmentCss = ".tile-title{display:block;margin-bottom:var(--ods-size-03)}.tile-description{display:block}.resub-link{display:block;margin-top:var(--ods-size-05)}.link-icon{display:inline list-item;margin-left:var(--ods-size-04)}";

var CommitmentStatus;
(function (CommitmentStatus) {
  CommitmentStatus["NONE"] = "none";
  CommitmentStatus["ENDED"] = "ended";
  CommitmentStatus["RENEWS"] = "renews";
  CommitmentStatus["REQUESTED"] = "requested";
  CommitmentStatus["ENDS"] = "ends";
})(CommitmentStatus || (CommitmentStatus = {}));
const MscBillingCommitment = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  getCommitmentStatus() {
    var _a, _b, _c, _d, _e, _f;
    if (new Date(((_b = (_a = this.serviceDetails) === null || _a === void 0 ? void 0 : _a.billing.engagement) === null || _b === void 0 ? void 0 : _b.endDate) || '') <
      new Date()) {
      return CommitmentStatus.ENDED;
    }
    if (new Date(((_d = (_c = this.serviceDetails) === null || _c === void 0 ? void 0 : _c.billing.engagement) === null || _d === void 0 ? void 0 : _d.endDate) || '') >
      new Date()) {
      return CommitmentStatus.RENEWS;
    }
    if ((_e = this.serviceDetails) === null || _e === void 0 ? void 0 : _e.billing.engagementRequest) {
      return CommitmentStatus.REQUESTED;
    }
    if ((_f = this.serviceDetails) === null || _f === void 0 ? void 0 : _f.billing.expirationDate) {
      return CommitmentStatus.ENDS;
    }
    return CommitmentStatus.NONE;
  }
  async componentWillLoad() {
    this.commitmentStatus = this.getCommitmentStatus();
  }
  getDescription() {
    var _a, _b;
    switch (this.commitmentStatus) {
      case CommitmentStatus.ENDED:
        return translate(this.localeStrings, 'manager_billing_subscription_engagement_status_engaged_expired', {
          endDate: this.nextBillingDate,
        });
      case CommitmentStatus.RENEWS:
        return translate(this.localeStrings, 'manager_billing_subscription_engagement_status_engaged_renew', {
          endDate: this.nextBillingDate,
        });
      case CommitmentStatus.REQUESTED:
        return translate(this.localeStrings, 'manager_billing_subscription_engagement_status_commitement_pending', {
          nextBillingDate: formatDate((_b = (_a = this.serviceDetails) === null || _a === void 0 ? void 0 : _a.billing.engagementRequest) === null || _b === void 0 ? void 0 : _b.requestDate, this.locale),
        });
      default:
        return '';
    }
  }
  render() {
    var _a;
    const description = this.getDescription();
    return (h(Host, null, h("osds-divider", { separator: true }), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.text }, this.localeStrings.manager_billing_subscription_engagement), !this.serviceDetails ? (h("osds-skeleton", null)) : (h(Fragment, null, description && (h("osds-text", { class: "tile-description", level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.default }, description)), this.commitmentStatus === CommitmentStatus.ENDS && (h("osds-chip", { color: ODS_THEME_COLOR_INTENT.error, size: ODS_CHIP_SIZE.sm, variant: ODS_CHIP_VARIANT.flat, inline: true }, translate(this.localeStrings, 'manager_billing_subscription_engagement_status_engaged', {
      endDate: this.nextBillingDate,
    }))), this.commitmentStatus === CommitmentStatus.NONE && (h("osds-text", { class: "tile-description", level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.default }, h("osds-chip", { color: ODS_THEME_COLOR_INTENT.error, size: ODS_CHIP_SIZE.sm, variant: ODS_CHIP_VARIANT.flat, inline: true }, this.localeStrings
      .manager_billing_subscription_engagement_status_none), h("osds-link", { class: "resub-link", "data-tracking": this.commitmentDataTracking, color: ODS_THEME_COLOR_INTENT.primary, href: (_a = this.urls) === null || _a === void 0 ? void 0 : _a.engagementCommitUrl, target: OdsHTMLAnchorElementTarget._blank }, this.localeStrings
      .manager_billing_subscription_engagement_commit, h("osds-icon", { class: "link-icon", size: ODS_ICON_SIZE.xxs, name: ODS_ICON_NAME.ARROW_RIGHT, color: ODS_THEME_COLOR_INTENT.primary }))))))));
  }
  get host() { return this; }
  static get style() { return mscBillingCommitmentCss; }
}, [1, "msc-billing-commitment", {
    "servicePath": [1, "service-path"],
    "nextBillingDate": [1, "next-billing-date"],
    "locale": [1],
    "localeStrings": [16],
    "serviceDetails": [16],
    "commitmentDataTracking": [1, "commitment-data-tracking"],
    "urls": [16],
    "commitmentStatus": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-billing-commitment", "osds-chip", "osds-divider", "osds-icon", "osds-link", "osds-skeleton", "osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-billing-commitment":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscBillingCommitment);
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

export { MscBillingCommitment as M, defaultLocale as a, defineCustomElement as d, formatDate as f };
