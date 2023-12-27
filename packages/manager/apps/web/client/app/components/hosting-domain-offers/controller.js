import moment from 'moment';
import groupBy from 'lodash/groupBy';

import {
  UCENTS_FACTOR,
  NEW_OFFERS_END_DATE,
  BADGES,
  NEW_OFFERS_PLAN_CODES,
  CATEGORIES_MAP,
  VERSION_MAP,
  CLOUDWEB_OFFER,
  CLOUDWEB_VERSION_MAP,
  WEB_CLOUD_DB_VALUES,
} from './constants';

export default class WebComponentsHostingDomainOffersController {
  /* @ngInject */
  constructor($translate, $filter) {
    this.$translate = $translate;
    const bytes = $filter('bytes');

    this.NEW_OFFERS = {
      PERSO: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(100000, undefined, false, 'MB')] },
          { prefix: 'emails', values: [10] },
          { prefix: 'cms', values: [] },
          { prefix: 'multisite', values: [] },
          { prefix: 'ftp', values: [] },
          { prefix: 'dbs', values: [1, bytes(500, undefined, false, 'MB')] },
        ],
        SELECTORS: {
          PERSO: {
            planCode: NEW_OFFERS_PLAN_CODES.PERSO,
          },
        },
      },
      PRO: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(250000, undefined, false, 'MB')] },
          { prefix: 'emails', values: [100] },
          { prefix: 'cms', values: [] },
          { prefix: 'multisite', values: [] },
          { prefix: 'ssh', values: [] },
          { prefix: 'dbs', values: [4, bytes(1000, undefined, false, 'MB')] },
        ],
        SELECTORS: {
          PRO: {
            planCode: NEW_OFFERS_PLAN_CODES.PRO,
          },
        },
      },
      PERFORMANCE: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(500000, undefined, false, 'MB')] },
          { prefix: 'emails', values: [1000] },
          { prefix: 'cms', values: [] },
          { prefix: 'multisite', values: [] },
          { prefix: 'ftp_ssh', values: [] },
          { prefix: 'resource', values: [] },
          { prefix: 'dbs', values: [4, bytes(1000, undefined, false, 'MB')] },
          { prefix: 'services', values: [1] },
          { prefix: 'cdn', values: [] },
        ],
        SELECTORS: {
          PERFORMANCE_1: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_1,
            cores: 2,
            ram: bytes(4000, undefined, false, 'MB'),
          },
          PERFORMANCE_2: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_2,
            cores: 4,
            ram: bytes(8000, undefined, false, 'MB'),
          },
          PERFORMANCE_3: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_3,
            cores: 6,
            ram: bytes(12000, undefined, false, 'MB'),
          },
          PERFORMANCE_4: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_4,
            cores: 8,
            ram: bytes(16000, undefined, false, 'MB'),
          },
        },
      },
    };
  }

  $onInit() {
    this.groupedOffers = this.buildOffersGroup();
  }

  static buildBadgeModel(type, className) {
    return {
      type,
      className,
    };
  }

  static getOfferPrice(offer) {
    return offer.versions.length > 1
      ? offer.selectedVersion.price
      : offer.price;
  }

  extendOffers() {
    return this.offers.flatMap((offer) => {
      if (!CLOUDWEB_OFFER.includes(offer.planCode)) {
        try {
          const category = WebComponentsHostingDomainOffersController.getOfferCategory(
            offer,
          );
          const offerVersion = VERSION_MAP[offer.planCode] || offer.planCode;
          const technicalsOffer = this.getOfferSelector(category, offerVersion);
          const { planCode } = technicalsOffer;
          const price = this.formatOfferPrice(category, planCode);

          return {
            ...offer,
            badge: WebComponentsHostingDomainOffersController.getOfferBadge(),
            planCode,
            category,
            selector: this.$translate.instant(
              `web_components_hosting_domain_offers_offer_select_version_performance`,
              {
                coreNumber: technicalsOffer.cores,
                ramSize: technicalsOffer.ram,
              },
            ),
            price,
          };
        } catch (e) {
          return [];
        }
      } else if (CLOUDWEB_OFFER.includes(offer.planCode) && offer.invoiceName) {
        return {
          ...offer,
          price: this.formatOfferPrice(null, offer.planCode),
          planCode: CLOUDWEB_VERSION_MAP[offer.planCode],
          category: offer.planCode,
          isCloudwebOffer: true,
        };
      }
      return [];
    });
  }

  buildOffersGroup() {
    const offers = this.extendOffers();
    const groupedOffers = groupBy(offers, 'category');

    return Object.keys(groupedOffers).map((category) => {
      const versions = groupedOffers[category];
      const selectedVersion = versions[0];

      return {
        category,
        versions,
        selectedVersion,
        price: selectedVersion.price,
      };
    });
  }

  static getOfferBadge() {
    const Ctrl = WebComponentsHostingDomainOffersController;

    // case new
    if (moment().isBefore(NEW_OFFERS_END_DATE)) {
      return Ctrl.buildBadgeModel(BADGES.NEW, 'info');
    }

    return Ctrl.buildBadgeModel('', '');
  }

  static getOfferCategory(offer) {
    return (CATEGORIES_MAP[offer.planCode] || offer.planCode).toLowerCase();
  }

  formatOfferPrice(offerCategory, planCode) {
    const selectedPlan = this.catalog.plans.find((plan) => {
      return plan.planCode === planCode;
    });
    const { interval, price } = selectedPlan.pricings.find(
      ({ intervalUnit }) => intervalUnit === 'month',
    );

    return `${(price / (interval * UCENTS_FACTOR)).toFixed(2)} ${
      this.user.currency.symbol
    }`;
  }

  getNewOffer(offerCategory) {
    return this.NEW_OFFERS[offerCategory.toUpperCase()];
  }

  getOfferTechnicalsInfo(offerCategory) {
    return this.getNewOffer(offerCategory).TECHNICALS.map(
      ({ prefix, values }) => {
        let serviceDatas = values[1];
        if (prefix === 'services' && !serviceDatas)
          serviceDatas = WEB_CLOUD_DB_VALUES;
        return this.$translate.instant(
          `web_components_hosting_domain_offers_offer_${offerCategory}_technicals_${prefix}`,
          { value1: values[0], value2: serviceDatas },
        );
      },
    );
  }

  getOfferSelector(offerCategory, offerVersion) {
    return this.getNewOffer(offerCategory)?.SELECTORS?.[offerVersion] || {};
  }
}
