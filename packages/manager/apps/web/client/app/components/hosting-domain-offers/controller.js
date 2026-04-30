import moment from 'moment';
import groupBy from 'lodash/groupBy';

import {
  UCENTS_FACTOR,
  NEW_OFFERS_END_DATE,
  BADGES,
  NEW_OFFERS_PLAN_CODES,
  OFFERS_PLAN_CODES,
  CATEGORIES_MAP,
  VERSION_MAP,
  CLOUDWEB_OFFER,
  CLOUDWEB_VERSION_MAP,
  WEB_CLOUD_DB_VALUES,
} from './constants';

export default class WebComponentsHostingDomainOffersController {
  /* @ngInject */
  constructor($translate, $filter, ovhFeatureFlipping) {
    this.$translate = $translate;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    const bytes = $filter('bytes');

    this.OFFERS = {
      FREE_100M: {
        TECHNICALS: [
          { prefix: 'sites', values: [1] },
          { prefix: 'disk', values: ['100 Mo SSD'] },
          { prefix: 'emailStorage', values: [1, '5 Go'] },
        ],
        SELECTORS: {
          FREE_100M: {
            planCode: OFFERS_PLAN_CODES.FREE_100M,
          },
        },
      },
      STARTER: {
        TECHNICALS: [
          { prefix: 'sites', values: [1] },
          { prefix: 'nddFree', values: [1] },
          { prefix: 'emailStorage', values: [2, '5 Go'] },
          { prefix: 'disk', values: ['1 Go SSD'] },
          { prefix: 'cms', values: [] },
        ],
        SELECTORS: {
          STARTER: {
            planCode: OFFERS_PLAN_CODES.STARTER,
          },
        },
      },
      PERSO: {
        TECHNICALS: [
          { prefix: 'sites', values: [5] },
          { prefix: 'nddFree', values: [1] },
          { prefix: 'emailStorage', values: [10, '5 Go'] },
          { prefix: 'disk', values: ['100 Go SSD'] },
          { prefix: 'cms', values: [] },
        ],
        SELECTORS: {
          PERSO: {
            planCode: OFFERS_PLAN_CODES.PERSO,
          },
        },
      },
      STARTUP: {
        TECHNICALS: [
          { prefix: 'vcores', values: ['< 1'] },
          { prefix: 'ram', values: ['< 1 Go'] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'disk', values: ['100 Go SSD'] },
          { prefix: 'sites', values: [5] },
          { prefix: 'emailStorage', values: [10, '5 Go'] },
          { prefix: 'dbs', values: [5, '1 Go'] },
          { prefix: 'nddFree', values: [1] },
        ],
        SELECTORS: {
          STARTUP: {
            planCode: OFFERS_PLAN_CODES.STARTUP,
          },
        },
      },
      PRO: {
        TECHNICALS: [
          { prefix: 'vcores', values: [1] },
          { prefix: 'ram', values: ['2 Go'] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'disk', values: ['250 Go SSD'] },
          { prefix: 'sites', values: [100] },
          { prefix: 'emailStorage', values: [100, '5 Go'] },
          { prefix: 'dbs', values: [10, '2 Go'] },
          { prefix: 'nddFree', values: [1] },
          { prefix: 'cdn', values: [] },
        ],
        SELECTORS: {
          PRO: {
            planCode: OFFERS_PLAN_CODES.PRO,
          },
        },
      },
      PERFORMANCE: {
        TECHNICALS: [
          { prefix: 'vcores', values: [2] },
          { prefix: 'ram', values: ['4 Go'] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'disk', values: ['500 Go'] },
          { prefix: 'sites', values: [150] },
          { prefix: 'emailStorage', values: [1000, '5 Go'] },
          { prefix: 'dbs', values: [20, '2 Go'] },
          { prefix: 'webcloudDb', values: [] },
          { prefix: 'nddFree', values: [1] },
          { prefix: 'cdn', values: [] },
        ],
        SELECTORS: {
          PERFORMANCE_1: {
            planCode: OFFERS_PLAN_CODES.PERFORMANCE_1,
          },
        },
      },
      AGENCY: {
        TECHNICALS: [
          { prefix: 'sites', values: [200] },
          { prefix: 'disk', values: ['500 Go SSD'] },
          { prefix: 'ram', values: ['8 Go'] },
          { prefix: 'vcores', values: [6] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'userManagement', values: [] },
          { prefix: 'emailStorage', values: [1000, '5 Go'] },
          { prefix: 'dbs', values: [30, '2 Go'] },
          { prefix: 'webcloudDb', values: [] },
          { prefix: 'cdn', values: [] },
          { prefix: 'git', values: [] },
        ],
        SELECTORS: {
          AGENCY: {
            planCode: OFFERS_PLAN_CODES.AGENCY,
          },
        },
      },
      AGENCY_PLUS: {
        TECHNICALS: [
          { prefix: 'sites', values: [500] },
          { prefix: 'disk', values: ['700 Go SSD'] },
          { prefix: 'ram', values: ['12 Go'] },
          { prefix: 'vcores', values: [10] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'userManagement', values: [] },
          { prefix: 'emailStorage', values: [1000, '5 Go'] },
          { prefix: 'dbs', values: [40, '2 Go'] },
          { prefix: 'webcloudDb', values: [] },
          { prefix: 'cdn', values: [] },
          { prefix: 'git', values: [] },
        ],
        SELECTORS: {
          AGENCY_PLUS: {
            planCode: OFFERS_PLAN_CODES.AGENCY_PLUS,
          },
        },
      },
      AGENCY_MAX: {
        TECHNICALS: [
          { prefix: 'sites', values: [3000] },
          { prefix: 'disk', values: ['1 To SSD'] },
          { prefix: 'ram', values: ['16 Go'] },
          { prefix: 'vcores', values: [14] },
          { prefix: 'backupIncluded', values: [] },
          { prefix: 'uptime', values: ['99,9%'] },
          { prefix: 'userManagement', values: [] },
          { prefix: 'emailStorage', values: [1000, '5 Go'] },
          { prefix: 'dbs', values: [50, '2 Go'] },
          { prefix: 'webcloudDb', values: [] },
          { prefix: 'cdn', values: [] },
          { prefix: 'git', values: [] },
        ],
        SELECTORS: {
          AGENCY_MAX: {
            planCode: OFFERS_PLAN_CODES.AGENCY_MAX,
          },
        },
      },
    };

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
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(['web-hosting:change-offer'])
      .then((featureAvailability) => {
        this.useNewOffers = featureAvailability.isFeatureAvailable(
          'web-hosting:change-offer',
        );
      })
      .catch(() => {
        this.useNewOffers = false;
      })
      .finally(() => {
        this.groupedOffers = this.buildOffersGroup();
      });
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
    const offers = this.useNewOffers ? this.OFFERS : this.NEW_OFFERS;
    return offers[offerCategory.toUpperCase()];
  }

  getOfferTechnicalsInfo(offerCategory) {
    return this.getNewOffer(offerCategory).TECHNICALS.map(
      ({ prefix, values }) => {
        let serviceDatas = values[1];
        if (prefix === 'services' && !serviceDatas)
          serviceDatas = WEB_CLOUD_DB_VALUES;
        const key = this.useNewOffers
          ? `web_components_hosting_domain_offers_${prefix}`
          : `web_components_hosting_domain_offers_offer_${offerCategory}_technicals_${prefix}`;
        return this.$translate.instant(key, {
          value1: values[0],
          value2: serviceDatas,
        });
      },
    );
  }

  getOfferSelector(offerCategory, offerVersion) {
    return this.getNewOffer(offerCategory)?.SELECTORS?.[offerVersion] || {};
  }
}
