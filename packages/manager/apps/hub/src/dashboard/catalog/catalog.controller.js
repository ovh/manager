import { groupBy, includes, isEmpty, map, uniq } from 'lodash-es';

export default class CatalogController {
  $onInit() {
    this.filterItems();
    this.categories = this.getAvailableCategories(this.products);
  }

  static groupItems(items) {
    return groupBy(items, 'universe');
  }

  getAvailableCategories() {
    const items = this.products.filter((product) =>
      CatalogController.filterByEnum(
        product,
        this.selectedUniverses,
        'universe',
      ),
    );
    return uniq(map(items, 'category')).sort();
  }

  filterItems() {
    const items = this.products.filter(
      (product) =>
        this.matchCategories(product) &&
        this.matchUniverses(product) &&
        this.matchSearchText(product),
    );
    this.items = CatalogController.groupItems(items);
    this.onFilterChange();
  }

  onUniverseChange() {
    this.filterItems();
    this.categories = this.getAvailableCategories();
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

  onFilterChange() {
    this.onSearch({
      universes: JSON.stringify(this.selectedUniverses),
      categories: JSON.stringify(this.selectedCategories),
      q: this.searchText,
    });
  }

  reset() {
    this.selectedCategories = [];
    this.selectedUniverses = [];
    this.searchText = null;
    this.$onInit();
  }

  static filterByEnum(product, query, property) {
    return isEmpty(query) || includes(query, product[property]);
  }
}
