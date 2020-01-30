import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';

export default class OvhCloudPriceHelper {
  /* @ngInject */
  constructor(
    $q,
    CucCurrencyService,
    cucUcentsToCurrencyFilter,
    OvhApiCloudProject,
    OvhApiMe,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.CucCurrencyService = CucCurrencyService;
    this.cucUcentsToCurrencyFilter = cucUcentsToCurrencyFilter;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiMe = OvhApiMe;
  }

  getPrices(serviceName) {
    return this.$q
      .all({
        catalog: this.OvhApiMe.v6()
          .get()
          .$promise.then(
            (me) =>
              this.OvhApiOrderCatalogPublic.v6().get({
                productName: 'cloud',
                ovhSubsidiary: me.ovhSubsidiary,
              }).$promise,
          ),
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
