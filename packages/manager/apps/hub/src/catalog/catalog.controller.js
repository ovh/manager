import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

export default class CatalogController {
  $onInit() {
    this.reset();
  }

  static groupItems(items) {
    return groupBy(items, 'universe');
  }

  filterItems() {
    const items = this.products.filter(
      (product) =>
        this.matchCategories(product) &&
        this.matchUniverses(product) &&
        this.matchSearchText(product),
    );

    this.items = CatalogController.groupItems(items);
  }

  matchCategories(product) {
    return CatalogController.filterByEnum(
      product,
      this.selectedCategories,
      'category',
    );
  }

  matchUniverses(product) {
    return CatalogController.filterByEnum(
      product,
      this.selectedUniverses,
      'universe',
    );
  }

  matchSearchText(product) {
    return (
      !this.searchText ||
      product.category.includes(this.searchText) ||
      product.universe.includes(this.searchText) ||
      product.productName.includes(this.searchText)
    );
  }

  reset() {
    this.items = CatalogController.groupItems(this.products);
    this.selectedCategories = [];
    this.selectedUniverses = [];
    this.searchText = null;
  }

  static filterByEnum(product, query, property) {
    return isEmpty(query) || includes(query, product[property]);
  }
}
