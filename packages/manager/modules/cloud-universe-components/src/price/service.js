import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';

export default class OvhCloudPriceHelper {
  /* @ngInject */
  constructor(
    $q,
    $http,
    coreConfig,
    CucCurrencyService,
    cucUcentsToCurrencyFilter,
    OvhApiCloudProject,
    OvhApiMe,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.CucCurrencyService = CucCurrencyService;
    this.cucUcentsToCurrencyFilter = cucUcentsToCurrencyFilter;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiMe = OvhApiMe;
  }

  getCatalog(endpoint, me) {
    return this.$http
      .get(endpoint, {
        params: {
          productName: 'cloud',
          ovhSubsidiary: me.ovhSubsidiary,
        },
      })
      .then(({ data: catalog }) => catalog);
  }

  /**
   * Get product prices
   * @param {string} serviceName : service for which we need info
   * @param {string} [catalogEndpoint = /order/catalog/public/cloud] : catalog endpoint where we got product info
   * @returns {Promise}: return prices promise
   */
  getPrices(serviceName, catalogEndpoint = '/order/catalog/public/cloud') {
    return this.$q
      .all({
        catalog: this.getCatalog(catalogEndpoint, this.coreConfig.getUser()),
        project: this.OvhApiCloudProject.v6().get({ serviceName }).$promise,
      })
      .then(({ catalog, project }) => {
        const projectPlan = find(catalog.plans, { planCode: project.planCode });
        if (!projectPlan) {
          throw new Error({ message: 'Fail to get project plan' });
        }

        const pricesMap = {};
        forEach(projectPlan.addonFamilies, (family) => {
          forEach(family.addons, (planCode) => {
            pricesMap[planCode] = this.transformPrice(
              find(
                get(find(catalog.addons, { planCode }), 'pricings'),
                ({ capacities }) =>
                  includes(capacities, 'renew') ||
                  includes(capacities, 'consumption'),
              ) || {},
              catalog.locale.currencyCode,
            );
          });
        });
        return pricesMap;
      });
  }

  transformPrice(price, currencyCode) {
    return {
      ...price,
      priceInUcents: price.price,
      intervalUnit: price.interval,
      price: {
        currencyCode,
        text: this.cucUcentsToCurrencyFilter(price.price),
        value: this.CucCurrencyService.convertUcentsToCurrency(price.price),
      },
    };
  }
}
