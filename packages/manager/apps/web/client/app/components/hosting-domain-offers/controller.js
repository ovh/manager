import moment from 'moment';
import groupBy from 'lodash/groupBy';

import {
  UCENTS_FACTOR,
  NEW_OFFERS_END_DATE,
  CURRENT_OFFERS,
  BADGES,
  NEW_OFFERS_PLAN_CODES,
} from './constants';

export default class WebComponentsHostingDomainOffersController {
  /* @ngInject */
  constructor($translate, $filter, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    const bytes = $filter('bytes');
    const planCodeKey = 'legacyPlanCode'; // planCode

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
            planCode: NEW_OFFERS_PLAN_CODES.PERSO[planCodeKey],
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
            planCode: NEW_OFFERS_PLAN_CODES.PRO[planCodeKey],
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
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_1[planCodeKey],
            cores: 2,
            ram: bytes(4000, undefined, false, 'MB'),
          },
          PERFORMANCE_2: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_2[planCodeKey],
            cores: 4,
            ram: bytes(8000, undefined, false, 'MB'),
          },
          PERFORMANCE_3: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_3[planCodeKey],
            cores: 6,
            ram: bytes(12000, undefined, false, 'MB'),
          },
          PERFORMANCE_4: {
            planCode: NEW_OFFERS_PLAN_CODES.PERFORMANCE_4[planCodeKey],
            cores: 8,
            ram: bytes(16000, undefined, false, 'MB'),
          },
        },
      },
    };
  }

  $onInit() {
    // build offers group
    this.groupedOffers = this.buildOffersGroup();

    // preselect equal offer (if exist)
    this.model = {
      offer: this.getEqualOffer(),
    };
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
    return this.offers.map((offer) => {
      const category = offer.value.startsWith('PERFORMANCE_')
        ? 'performance'
        : offer.value.toLowerCase();
      const technicalsOffer = this.getOfferSelector(category, offer.value);
      const { planCode } = technicalsOffer;
      const price = this.formatOfferPrice(category, planCode);

      return {
        ...offer,
        badge: this.getOfferBadge(offer),
        planCode,
        category,
        selector: this.$translate.instant(
          `web_components_hosting_domain_offers_offer_select_version_performance`,
          { coreNumber: technicalsOffer.cores, ramSize: technicalsOffer.ram },
        ),
        price,
      };
    });
  }

  buildOffersGroup() {
    const offers = this.extendOffers();
    const groupedOffers = groupBy(offers, 'category');

    return Object.keys(groupedOffers).map((category) => {
      const versions = groupedOffers[category];
      const equalOffer = versions.find(
        ({ badge }) => badge.type === BADGES.EQUAL,
      );
      const selectedVersion = equalOffer || versions[0];

      return {
        category,
        versions,
        selectedVersion,
        price: selectedVersion.price,
      };
    });
  }

  getEqualOffer() {
    return this.groupedOffers.find(
      ({ selectedVersion }) => selectedVersion.badge.type === BADGES.EQUAL,
    );
  }

  getOfferBadge(offer) {
    const Ctrl = WebComponentsHostingDomainOffersController;
    const CURRENT_OFFER = CURRENT_OFFERS[this.currentOffer];

    // upgrade case
    if (CURRENT_OFFER?.upgrade?.includes(offer.value)) {
      return Ctrl.buildBadgeModel(BADGES.UPGRADE, 'warning');
    }

    // equal case
    if (CURRENT_OFFER?.equal?.includes(offer.value)) {
      return Ctrl.buildBadgeModel(BADGES.EQUAL, 'success');
    }

    // downgrade case
    if (
      this.coreConfig.isRegion('EU') &&
      CURRENT_OFFER?.downgrade?.includes(offer.value)
    ) {
      return Ctrl.buildBadgeModel(BADGES.DOWNGRADE, 'error');
    }

    // case new
    if (moment().isBefore(NEW_OFFERS_END_DATE)) {
      return Ctrl.buildBadgeModel(BADGES.NEW, 'info');
    }

    return Ctrl.buildBadgeModel('', '');
  }

  formatOfferPrice(offerCategory, planCode) {
    const selectedPlan = this.catalog.plans.find((plan) => {
      return plan.planCode === planCode;
    });
    const { price, tax } = selectedPlan.pricings.find(
      ({ intervalUnit }) => intervalUnit === 'month',
    );

    return `${((price - tax) / UCENTS_FACTOR).toFixed(2)} ${
      this.user.currency.symbol
    }`;
  }

  getNewOffer(offerCategory) {
    return this.NEW_OFFERS[offerCategory.toUpperCase()];
  }

  getOfferTechnicalsInfo(offerCategory) {
    return this.getNewOffer(offerCategory).TECHNICALS.map(
      ({ prefix, values }) => {
        return this.$translate.instant(
          `web_components_hosting_domain_offers_offer_${offerCategory}_technicals_${prefix}`,
          { value1: values[0], value2: values[1] },
        );
      },
    );
  }

  getOfferSelector(offerCategory, offerVersion) {
    return this.getNewOffer(offerCategory)?.SELECTORS?.[offerVersion] || {};
  }
}
