import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import { CATALOG_PRODUCT } from './hosting-database-order-private.constant';

export default class HostingDatabaseOrderPrivateService {
  /* @ngInject */
  constructor($filter, Hosting, WucOrderCartService) {
    this.$filter = $filter;
    this.Hosting = Hosting;
    this.WucOrderCartService = WucOrderCartService;
  }

  async getCatalogProducts(ovhSubsidiary, products) {
    if (!products || !products.length) {
      return [];
    }

    const { name, category } = CATALOG_PRODUCT;
    const catalog = await this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      name,
    );

    return products.map((item) =>
      find(catalog[category], { planCode: item.planCode }),
    );
  }

  async getServices() {
    const services = await this.Hosting.getHostings();

    return services.sort();
  }

  async getDatacenter(serviceName) {
    const { datacenter } = await this.Hosting.getHosting(serviceName);

    return datacenter;
  }

  async getProducts(cartId) {
    const result = await this.WucOrderCartService.getProductOffers(
      cartId,
      'privateSQL',
    );

    if (!result.length) {
      return undefined;
    }

    // Get RAM from the productName, and sort the results
    const products = result.map((product) => {
      const [ramSize] = product.productName.match(/\d+/g);
      return {
        ...product,
        label: this.$filter('cucBytes')(ramSize, undefined, false, 'MB'),
        ramSize: parseInt(ramSize, 10),
      };
    });

    return sortBy(products, 'ramSize');
  }

  async prepareOrderCart(ovhSubsidiary) {
    const { cartId } = await this.WucOrderCartService.createNewCart(
      ovhSubsidiary,
    );

    await this.WucOrderCartService.assignCart(cartId);

    return cartId;
  }

  async addItemToCart(cartId, datacenter, price, product, version) {
    const { itemId } = await this.WucOrderCartService.addProductToCart(
      cartId,
      'privateSQL',
      {
        duration: price.duration,
        planCode: product.planCode,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    );

    await this.WucOrderCartService.addConfigurationItem(
      cartId,
      itemId,
      'dc',
      datacenter,
    );
    await this.WucOrderCartService.addConfigurationItem(
      cartId,
      itemId,
      'engine',
      version,
    );

    return this.WucOrderCartService.getCheckoutInformations(cartId);
  }

  resetOrderCart(cartId) {
    return this.WucOrderCartService.deleteAllItems(cartId);
  }

  checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId) {
    return this.WucOrderCartService.checkoutCart(cartId, {
      autoPayWithPreferredPaymentMethod,
    });
  }
}
