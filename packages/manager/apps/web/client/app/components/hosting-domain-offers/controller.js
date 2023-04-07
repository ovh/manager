import groupBy from 'lodash/groupBy';

export const UCENTS_FACTOR = 1000000000;

export default class WebComponentsHostingDomainOffersController {
  /* @ngInject */
  constructor($translate, $filter) {
    this.$translate = $translate;
    const bytes = $filter('bytes');

    this.OFFERS_INFO = {
      PERSO: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(1000, undefined, false, 'MB')] },
          { prefix: 'emails', values: [10] },
          { prefix: 'cms', values: [] },
          { prefix: 'multisite', values: [] },
          { prefix: 'ftp', values: [] },
          { prefix: 'dbs', values: [1, bytes(500, undefined, false, 'MB')] },
        ],
        SELECTORS: {
          PERSO: { planCode: 'perso2014' },
        },
      },
      PRO: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(2500, undefined, false, 'MB')] },
          { prefix: 'emails', values: [100] },
          { prefix: 'cms', values: [] },
          { prefix: 'multisite', values: [] },
          { prefix: 'ssh', values: [] },
          { prefix: 'dbs', values: [4, bytes(1000, undefined, false, 'MB')] },
        ],
        SELECTORS: {
          PRO: { planCode: 'pro2014' },
        },
      },
      PERFORMANCE: {
        TECHNICALS: [
          { prefix: 'discs', values: [bytes(2500, undefined, false, 'MB')] },
          { prefix: 'emails', values: [100] },
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
            planCode: 'perf2014x1',
            cores: 2,
            ram: bytes(4000, undefined, false, 'MB'),
          },
          PERFORMANCE_2: {
            planCode: 'perf2014x2',
            cores: 4,
            ram: bytes(8000, undefined, false, 'MB'),
          },
          PERFORMANCE_3: {
            planCode: 'perf2014x3',
            cores: 6,
            ram: bytes(12000, undefined, false, 'MB'),
          },
          PERFORMANCE_4: {
            planCode: 'perf2014x4',
            cores: 8,
            ram: bytes(16000, undefined, false, 'MB'),
          },
        },
      },
    };
  }

  $onInit() {
    const offers = this.offers.map((offer) => {
      const category = offer.value.startsWith('PERFORMANCE_')
        ? 'performance'
        : offer.value.toLowerCase();
      const technicalsOffer = this.getOfferSelector(category, offer.value);
      const price = this.formatOfferPrice(category, technicalsOffer.planCode);

      return {
        ...offer,
        category,
        selector: this.$translate.instant(
          `web_components_hosting_domain_offers_offer_select_version_performance`,
          { coreNumber: technicalsOffer.cores, ramSize: technicalsOffer.ram },
        ),
        price,
      };
    });
    const groupedOffers = groupBy(offers, 'category');
    this.groupedOffers = Object.keys(groupedOffers).map((category) => {
      const versions = groupedOffers[category];
      const selectedVersion = versions.length > 1 ? versions[0] : null;

      return { category, versions, selectedVersion, price: versions[0].price };
    });

    this.model = {
      offer: null,
    };
  }

  formatOfferPrice(offerCategory, planCode) {
    const selectedPlan = this.catalog.plans.find((plan) => {
      return plan.planCode === planCode;
    });
    const { price } = selectedPlan.pricings.find(
      ({ intervalUnit }) => intervalUnit === 'month',
    );

    return `${price / UCENTS_FACTOR} ${this.user.currency.symbol}`;
  }

  getOfferInfo(offerCategory) {
    return this.OFFERS_INFO[offerCategory.toUpperCase()];
  }

  getOfferTechnicalsInfo(offerCategory) {
    return this.getOfferInfo(offerCategory).TECHNICALS.map(
      ({ prefix, values }) => {
        return this.$translate.instant(
          `web_components_hosting_domain_offers_offer_${offerCategory}_technicals_${prefix}`,
          { value1: values[0], value2: values[1] },
        );
      },
    );
  }

  getOfferSelector(offerCategory, offerVersion) {
    return this.getOfferInfo(offerCategory)?.SELECTORS?.[offerVersion] || {};
  }

  static getOfferPrice(offer) {
    return offer.versions.length > 1
      ? offer.selectedVersion.price
      : offer.price;
  }
}
