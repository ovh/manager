import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';

export default class NetappShareCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;

    this.shareStateEnum = [
      'creating',
      'available',
      'deleting',
      'deleted',
      'error',
      'inactive',
    ];
  }

  $onInit() {
    this.stateEnumFilter = this.getEnumFilter(
      this.shareStateEnum,
      'share_netapp_status_',
    );

    this.columnsConfig = [
      { name: 'id', sortable: this.getSorting('id') },
      { name: 'name', sortable: this.getSorting('name') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'product', sortable: this.getSorting('product') },
      { name: 'datacenter', sortable: this.getSorting('region') },
      { name: 'status', sortable: this.getSorting('status') },
    ];
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
