import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';

export default class StorageCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.columnsConfig = [
      { name: 'id', sortable: this.getSorting('id') },
      { name: 'product', sortable: this.getSorting('product') },
      { name: 'datacenter', sortable: this.getSorting('region') },
      { name: 'state', sortable: this.getSorting('status') },
    ];
    this.storages = [];
  }

  static toUpperSnakeCase(str) {
    return snakeCase(str).toUpperCase();
  }

  getEnumFilter(list, translationPrefix) {
    return {
      values: reduce(
        list,
        (result, item) => ({
          ...result,
          [item]: this.$translate.instant(
            `${translationPrefix}${this.constructor.toUpperSnakeCase(item)}`,
          ),
        }),
        {},
      ),
    };
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder.toLowerCase() : '';
  }
}
