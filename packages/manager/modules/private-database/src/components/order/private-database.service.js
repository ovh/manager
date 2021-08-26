import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import { CATALOG_PRODUCT } from './private-database.constant';

export default class OrderPrivateDatabaseService {
  /* @ngInject */
  constructor($filter, $q, OvhHttp, WucOrderCartService) {
    this.$filter = $filter;
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.WucOrderCartService = WucOrderCartService;
  }

  static getCatalogProducts(catalog, products) {
    if (!products || !products.length) {
      return [];
    }
    const { category } = CATALOG_PRODUCT;
    return products.map((item) =>
      find(catalog[category], { planCode: item.planCode }),
    );
  }

  async getCatalog(ovhSubsidiary) {
    const { name } = CATALOG_PRODUCT;
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      name,
    );
  }

  async getServices() {
    const services = await this.getHostings();
    return services.sort();
  }

  getDatacenter(serviceName) {
    return this.getHosting(serviceName).then((hosting) => hosting.datacenter);
  }

  getHostings() {
    return this.OvhHttp.get('/hosting/web', {
      rootPath: 'apiv6',
    });
  }

  getHosting(serviceName) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}`, {
      rootPath: 'apiv6',
    });
  }

  getProducts(catalog) {
    // Get RAM from the productName, and sort the results
    const products = catalog.plans.map((product) => {
      const [ramSize] = product.invoiceName.match(/\d+/g);
      return {
        ...product,
        label: this.$filter('cucBytes')(ramSize, undefined, false, 'MB'),
        ramSize: parseInt(ramSize, 10),
      };
    });
    return sortBy(products, 'ramSize');
  }
}
