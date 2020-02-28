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

  onCategoryChange() {
    const items = this.products.filter((product) =>
      CatalogController.filterByEnum(
        product,
        this.selectedCategories,
        'category',
      ),
    );
    this.items = CatalogController.groupItems(items);
  }

  onUniverseChange() {
    const items = this.products.filter((product) =>
      CatalogController.filterByEnum(
        product,
        this.selectedUniverses,
        'universe',
      ),
    );
    this.items = CatalogController.groupItems(items);
  }

  onSearch(searchText) {
    const items = this.products.filter(
      (product) =>
        !searchText ||
        product.category.includes(searchText) ||
        product.universe.includes(searchText) ||
        product.productName.includes(searchText),
    );
    this.items = CatalogController.groupItems(items);
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
