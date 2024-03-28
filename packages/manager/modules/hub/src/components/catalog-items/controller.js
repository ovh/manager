export default class {
  /* @ngInject */
  constructor(hubCatalogItemsService, $translate) {
    this.$translate = $translate;
    this.hubCatalogItemsService = hubCatalogItemsService;
  }

  $onInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.loading = true;

    this.hubCatalogItemsService
      .getCatalogItems()
      .then((products) => {
        this.items = Object.keys(products).length > 0 ? products : null;
      })
      .catch(() => null)
      .finally(() => {
        this.loading = false;
      });
  }

  formatTracker(universe, product) {
    return `${this.trackingPrefix}::catalog::${universe
      .toLowerCase()
      .replace(' ', '-')}::${product.productName
      .toLowerCase()
      .replace(/_/g, '-')}::order`;
  }
}
