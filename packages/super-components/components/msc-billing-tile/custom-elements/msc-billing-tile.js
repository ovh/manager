import { proxyCustomElement, HTMLElement, h, Fragment, Host } from '@stencil/core/internal/client';
import { O as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE } from './ods-theme-typography-size2.js';
import { d as defineCustomElement$3 } from './osds-text2.js';
import { d as defineCustomElement$e } from './menu-custom2.js';
import { d as defineCustomElement$d, a as defaultLocale, f as formatDate } from './msc-billing-commitment2.js';
import { d as defineCustomElement$c } from './msc-billing-contact2.js';
import { d as defineCustomElement$b } from './msc-billing-offer2.js';
import { d as defineCustomElement$a } from './msc-billing-renewal2.js';
import { d as defineCustomElement$9 } from './osds-button2.js';
import { d as defineCustomElement$8 } from './osds-chip2.js';
import { d as defineCustomElement$7 } from './osds-divider2.js';
import { d as defineCustomElement$6 } from './osds-icon2.js';
import { d as defineCustomElement$5 } from './osds-link2.js';
import { d as defineCustomElement$4 } from './osds-skeleton2.js';
import { d as defineCustomElement$2 } from './osds-tile2.js';
import { a as apiClient } from './client.js';

const buildURLPattern = (pattern, params) => {
    let url = pattern;
    let filteredParams = params;
    if (pattern.includes(':') && params) {
        const PARAM_REGEXP = /:(\w+)/g;
        const urlParamTemplates = [...pattern.matchAll(PARAM_REGEXP)].map(([, name]) => name);
        urlParamTemplates.forEach((urlParam) => {
            if (params[urlParam]) {
                url = url.replace(`:${urlParam}`, encodeURIComponent(params[urlParam]));
            }
        });
        filteredParams = Object.keys(params).reduce((queryParams, paramName) => {
            if (!urlParamTemplates.includes(paramName)) {
                return Object.assign(Object.assign({}, queryParams), { [paramName]: params[paramName] });
            }
            return queryParams;
        }, {});
    }
    return { url, params: filteredParams };
};
const buildQueryString = (data) => Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
const buildURL = (baseURL, path, params) => {
    const urlPattern = buildURLPattern(path, params);
    let { url: buildedPath } = urlPattern;
    const { params: queryObject } = urlPattern;
    if (baseURL.includes('#') && buildedPath.includes('#')) {
        buildedPath = buildedPath.replace('#', '');
    }
    if (baseURL.endsWith('/') && buildedPath.startsWith('/')) {
        buildedPath = buildedPath.substring(1);
    }
    let queryString = queryObject ? buildQueryString(queryObject) : '';
    if (queryString) {
        queryString = buildedPath.includes('?')
            ? `&${queryString}`
            : `?${queryString}`;
    }
    return `${baseURL}${buildedPath}${queryString}`;
};

const defaultRegion = 'EU';
const hostnameByRegion = {
    EU: 'www.ovh.com/',
    CA: 'ca.ovh.com/',
    US: 'us.ovhcloud.com/',
};
const defaultSubsidiary = 'FR';
const baseUrls = {
    EU: {
        DE: `${hostnameByRegion.EU}de/`,
        ES: `${hostnameByRegion.EU}es/`,
        FR: `${hostnameByRegion.EU}fr/`,
        GB: `${hostnameByRegion.EU}en-gb/`,
        IE: `${hostnameByRegion.EU}en-ie/`,
        IT: `${hostnameByRegion.EU}it/`,
        MA: `${hostnameByRegion.EU}fr-ma/`,
        NL: `${hostnameByRegion.EU}en-ie/`,
        PL: `${hostnameByRegion.EU}pl/`,
        PT: `${hostnameByRegion.EU}pt/`,
        SN: `${hostnameByRegion.EU}fr-sn/`,
        TN: `${hostnameByRegion.EU}fr-tn/`,
    },
    CA: {
        ASIA: `${hostnameByRegion.CA}asia/`,
        AU: `${hostnameByRegion.CA}en-au/`,
        CA: `${hostnameByRegion.CA}en-ca/`,
        QC: `${hostnameByRegion.CA}fr-ca/`,
        SG: `${hostnameByRegion.CA}en-sg/`,
        WE: `${hostnameByRegion.CA}en/`,
        WS: `${hostnameByRegion.CA}es/`,
    },
    US: {
        US: hostnameByRegion.US,
    },
};
const getURL = ({ region, subsidiary, appPublicURL, path = '', params = {}, }) => buildURL(appPublicURL ??
    baseUrls[region]?.[subsidiary] ??
    hostnameByRegion[region] ??
    window.location.origin, path, params);

/**
 * Import dynamically the right translation file
 */
async function getTranslations(locale) {
  try {
    switch (locale) {
      case 'de-DE':
        return await import('./Messages_de_DE.js');
      case 'en-GB':
        return await import('./Messages_en_GB.js');
      case 'es-ES':
        return await import('./Messages_es_ES.js');
      case 'fr-CA':
        return await import('./Messages_fr_CA.js');
      case 'fr-FR':
        return await import('./Messages_fr_FR.js');
      case 'it-IT':
        return await import('./Messages_it_IT.js');
      case 'pl-PL':
        return await import('./Messages_pl_PL.js');
      case 'pt-PT':
        return await import('./Messages_pt_PT.js');
      default:
        return await import('./Messages_fr_FR.js');
    }
  }
  catch (_a) {
    throw new Error(`No translations found for locale ${locale}`);
  }
}

const getBillingTileURLs = ({ appPublicURL, region, subsidiary, serviceName, serviceType, servicePath, }) => ({
  engagementCommitUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/${servicePath}/dashboard/commitment`,
  }),
  contactManagementUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/contacts/services?serviceName=${serviceName}`,
  }),
  changeOwnerUrl: getURL({
    region,
    subsidiary,
    path: '/cgi-bin/procedure/procedureChangeOwner.cgi',
  }),
  changeDomainOwnerUrl: getURL({
    region,
    subsidiary,
    path: `/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'${serviceName})`,
  }),
  updateOwnerUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/contact/${serviceName}/{ownerId}`,
  }),
  renewUrl: getURL({
    region,
    subsidiary,
    path: `/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`,
  }),
  cancelResiliationUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/${servicePath}/dashboard/cancel-resiliation`,
  }),
  manageRenewUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/billing/autorenew/update?serviceId=${serviceName}&serviceType=${serviceType}`,
  }),
  manageCommitmentUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/server/${serviceName}/commitment`,
  }),
  anticipateRenew: getURL({
    appPublicURL,
    path: `/${servicePath}/commitment`,
  }),
  resiliateUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`,
  }),
  changeOfferUrl: `${window.location.href}/${serviceType === 'EMAIL_DOMAIN' ? 'upgrade' : 'change_offer'}`,
});

const mscBillingTileCss = ".msc-billing-tile-wrapper{display:block;text-decoration:none;padding:var(--ods-size-01)}.msc-billing-tile-wrapper .billing-tile-content{display:flex;flex-direction:column;width:100%;padding:var(--ods-size-01)}.msc-billing-tile-wrapper .billing-tile-content .tooltiplinks{display:inline-grid}.msc-billing-tile-wrapper .billing-tile-content .link-icon{margin-left:var(--ods-size-03)}.msc-billing-tile-wrapper .block{position:relative}";

const MscBillingTile$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.locale = defaultLocale;
    this.region = defaultRegion;
    this.subsidiary = defaultSubsidiary;
  }
  setURLs() {
    this.urls = getBillingTileURLs({
      appPublicURL: this.appPublicUrl,
      region: this.region,
      subsidiary: this.subsidiary,
      serviceName: this.getServiceName(),
      servicePath: this.servicePath,
      serviceType: this.getServiceType(),
    });
  }
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }
  async componentWillLoad() {
    this.setURLs();
    this.updateTranslations();
    apiClient.v6.get(`${this.servicePath}/serviceInfos`).then((response) => {
      var _a;
      this.serviceInfos = response.data;
      apiClient.v6
        .get(`/services/${(_a = this.serviceInfos) === null || _a === void 0 ? void 0 : _a.serviceId}`)
        .then((responseDetails) => {
        this.serviceDetails = responseDetails.data;
      });
    });
  }
  getServiceName() {
    return this.servicePath.substring(this.servicePath.lastIndexOf('/') + 1);
  }
  getServiceType() {
    return this.servicePath
      .substring(this.servicePath.startsWith('/') ? 1 : 0, this.servicePath.lastIndexOf('/'))
      .split('/')
      .join('_')
      .toUpperCase();
  }
  getFormattedNextBillingDate() {
    var _a;
    return this.serviceDetails
      ? formatDate((_a = this.serviceDetails.billing) === null || _a === void 0 ? void 0 : _a.nextBillingDate, this.locale)
      : '';
  }
  getCreationDateBlock() {
    var _a;
    return (h(Fragment, null, h("osds-divider", { separator: true }), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.text }, (_a = this.localeStrings) === null || _a === void 0 ? void 0 : _a.manager_billing_subscription_creation), this.serviceInfos ? (h("osds-text", { class: "tile-description", level: ODS_THEME_TYPOGRAPHY_LEVEL.body, size: ODS_THEME_TYPOGRAPHY_SIZE._200, color: ODS_THEME_COLOR_INTENT.default }, formatDate(this.serviceInfos.creation, this.locale))) : (h("osds-skeleton", null))));
  }
  render() {
    if (!this.localeStrings || !this.urls) {
      return (h("osds-tile", { rounded: true, inline: true }, h("osds-skeleton", null)));
    }
    return (h(Host, null, h("div", { class: "msc-billing-tile-wrapper" }, h("osds-tile", { rounded: true }, h("div", { class: "billing-tile-content" }, h("osds-text", { level: ODS_THEME_TYPOGRAPHY_LEVEL.heading, size: ODS_THEME_TYPOGRAPHY_SIZE._300, color: ODS_THEME_COLOR_INTENT.text }, this.localeStrings.manager_billing_subscription), this.getCreationDateBlock(), h("msc-billing-offer", { class: "block", serviceType: this.getServiceType(), servicePath: this.servicePath, serviceInfos: this.serviceInfos, serviceDetails: this.serviceDetails, localeStrings: this.localeStrings, urls: this.urls, changeOfferDataTracking: this.changeOfferDataTracking }), h("msc-billing-renewal", { class: "block", serviceInfos: this.serviceInfos, serviceDetails: this.serviceDetails, localeStrings: this.localeStrings, serviceName: this.getServiceName(), serviceType: this.getServiceType(), servicePath: this.servicePath, nextBillingDate: this.getFormattedNextBillingDate(), urls: this.urls, renewLinkDataTracking: this.renewLinkDataTracking, cancelResiliationDataTracking: this.cancelResiliationDataTracking, manageRenewDataTracking: this.manageRenewDataTracking, resiliateDataTracking: this.resiliateDataTracking, anticipateRenewDataTracking: this.anticipateRenewDataTracking }), h("msc-billing-commitment", { class: "block", servicePath: this.servicePath, serviceDetails: this.serviceDetails, nextBillingDate: this.getFormattedNextBillingDate(), locale: this.locale, localeStrings: this.localeStrings, urls: this.urls, commitmentDataTracking: this.commitmentDataTracking }), h("msc-billing-contact", { class: "block", serviceInfos: this.serviceInfos, localeStrings: this.localeStrings, serviceName: this.getServiceName(), serviceType: this.getServiceType(), urls: this.urls, changeOwnerDataTracking: this.changeOwnerDataTracking, updateOwnerDataTracking: this.updateOwnerDataTracking, subscriptionManagementDataTracking: this.subscriptionManagementDataTracking }))))));
  }
  get host() { return this; }
  static get watchers() { return {
    "appPublicUrl": ["setURLs"],
    "region": ["setURLs"],
    "subsidiary": ["setURLs"],
    "servicePath": ["setURLs"],
    "locale": ["updateTranslations"]
  }; }
  static get style() { return mscBillingTileCss; }
}, [1, "msc-billing-tile", {
    "locale": [1],
    "servicePath": [1, "service-path"],
    "appPublicUrl": [1, "app-public-url"],
    "region": [1],
    "subsidiary": [1],
    "commitmentDataTracking": [1, "commitment-data-tracking"],
    "changeOwnerDataTracking": [1, "change-owner-data-tracking"],
    "updateOwnerDataTracking": [1, "update-owner-data-tracking"],
    "subscriptionManagementDataTracking": [1, "subscription-management-data-tracking"],
    "renewLinkDataTracking": [1, "renew-link-data-tracking"],
    "cancelResiliationDataTracking": [1, "cancel-resiliation-data-tracking"],
    "manageRenewDataTracking": [1, "manage-renew-data-tracking"],
    "resiliateDataTracking": [1, "resiliate-data-tracking"],
    "anticipateRenewDataTracking": [1, "anticipate-renew-data-tracking"],
    "changeOfferDataTracking": [1, "change-offer-data-tracking"],
    "localeStrings": [32],
    "serviceInfos": [32],
    "serviceDetails": [32],
    "urls": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-billing-tile", "menu-custom", "msc-billing-commitment", "msc-billing-contact", "msc-billing-offer", "msc-billing-renewal", "osds-button", "osds-chip", "osds-divider", "osds-icon", "osds-link", "osds-skeleton", "osds-text", "osds-tile"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-billing-tile":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscBillingTile$1);
      }
      break;
    case "menu-custom":
      if (!customElements.get(tagName)) {
        defineCustomElement$e();
      }
      break;
    case "msc-billing-commitment":
      if (!customElements.get(tagName)) {
        defineCustomElement$d();
      }
      break;
    case "msc-billing-contact":
      if (!customElements.get(tagName)) {
        defineCustomElement$c();
      }
      break;
    case "msc-billing-offer":
      if (!customElements.get(tagName)) {
        defineCustomElement$b();
      }
      break;
    case "msc-billing-renewal":
      if (!customElements.get(tagName)) {
        defineCustomElement$a();
      }
      break;
    case "osds-button":
      if (!customElements.get(tagName)) {
        defineCustomElement$9();
      }
      break;
    case "osds-chip":
      if (!customElements.get(tagName)) {
        defineCustomElement$8();
      }
      break;
    case "osds-divider":
      if (!customElements.get(tagName)) {
        defineCustomElement$7();
      }
      break;
    case "osds-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$6();
      }
      break;
    case "osds-link":
      if (!customElements.get(tagName)) {
        defineCustomElement$5();
      }
      break;
    case "osds-skeleton":
      if (!customElements.get(tagName)) {
        defineCustomElement$4();
      }
      break;
    case "osds-text":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "osds-tile":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const MscBillingTile = MscBillingTile$1;
const defineCustomElement = defineCustomElement$1;

export { MscBillingTile, defineCustomElement$1 as d, defineCustomElement };
