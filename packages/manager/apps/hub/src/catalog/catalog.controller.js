import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

export default class CatalogController {
  $onInit() {
    this.reset();
  }

  static groupItems(items) {
    return groupBy(items, 'universe');
  }

  static getAvailableCategories(products) {
    return uniq(map(products, 'category')).sort();
  }

  filterItems() {
    const items = this.products.filter(
      (product) =>
        this.matchCategories(product) &&
        this.matchUniverses(product) &&
        this.matchSearchText(product),
    );
    this.items = CatalogController.groupItems(items);
    return items;
  }

  onUniverseChange() {
    const items = this.filterItems();
    this.categories = CatalogController.getAvailableCategories(items);
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
    const search = this.searchText && this.searchText.toLowerCase();
    return (
      !search ||
      product.category.toLowerCase().includes(search) ||
      product.universe.toLowerCase().includes(search) ||
      product.name.toLowerCase().includes(search)
    );
  }

  reset() {
    this.items = CatalogController.groupItems(this.products);
    this.categories = CatalogController.getAvailableCategories(this.products);
    this.selectedCategories = [];
    this.selectedUniverses = [];
    this.searchText = null;
  }

  static filterByEnum(product, query, property) {
    return isEmpty(query) || includes(query, product[property]);
  }
}
