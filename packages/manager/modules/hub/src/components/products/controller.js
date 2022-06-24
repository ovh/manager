import {
  DEFAULT_DISPLAYED_TILES,
  DISPLAYED_PRODUCTS_NUMBER,
} from './constants';

import { getProductListingRoute } from './listing-pages.constants';

export default class ProductsController {
  /* @ngInject */
  constructor($state, $window, atInternet, coreURLBuilder) {
    this.DEFAULT_DISPLAYED_TILES = DEFAULT_DISPLAYED_TILES;
    this.DISPLAYED_PRODUCTS_NUMBER = DISPLAYED_PRODUCTS_NUMBER;
    this.$state = $state;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.fetchProducts();
    this.skeletonServices = Array.from({ length: 6 });
    this.skeletonProducts = Array.from({ length: 4 });
  }

  fetchProducts() {
    if (this.products && this.products.length) return;

    this.loading = true;
    this.productsPromise
      .then((data) => {
        this.products = data;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  toggleExpand() {
    this.expand = !this.expand;
  }

  static formatProductTypeTracker(productType) {
    return productType.toLowerCase().replace(/_/g, '-');
  }

  goToProductPage({ productType }) {
    this.atInternet.trackClick({
      name: `${
        this.trackingPrefix
      }::product::${productType.toLowerCase().replace(/_/g, '-')}::show-all`,
      type: 'action',
    });
    const { application, hash } = getProductListingRoute(productType);
    if (application && hash) {
      this.$window.open(
        this.coreURLBuilder.buildURL(application, hash),
        '_top',
      );
    }
  }
}
