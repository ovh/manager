import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

export default class ClusterCtrl {
  /* @ngInject */
  constructor($q, $translate, $window, ouiDatagridService) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.criteria = JSON.parse(this.filter).map((criteria) => ({
      property: criteria.field || 'name',
      operator: criteria.comparator,
      value: criteria.reference[0],
    }));

    this.regionEnumFilter = this.getEnumFilterFromCustomerData(
      this.dedicatedClusters.data,
      'region',
    );

    this.modelEnumFilter = this.getEnumFilterFromCustomerData(
      this.dedicatedClusters.data,
      'model',
    );
  }

  static toUpperSnakeCase(str) {
    return snakeCase(str).toUpperCase();
  }

  gotoOrderUrl() {
    return this.$window.open(this.orderUrl, '_blank');
  }

  getEnumFilterFromCustomerData(data, attribute, prefix = null) {
    return this.getEnumFilter(
      data
        .map((server) => server[attribute])
        .filter((value, index, self) => self.indexOf(value) === index),
      prefix,
      false,
    );
  }

  getEnumFilter(list, translationPrefix, toUpperSnakeCaseFlag = true) {
    if (translationPrefix === null) {
      return {
        values: list.reduce(
          (result, item) => ({
            ...result,
            [item]: toUpperSnakeCaseFlag
              ? this.constructor.toUpperSnakeCase(item)
              : item,
          }),
          {},
        ),
      };
    }
    return {
      values: list.reduce(
        (result, item) => ({
          ...result,
          [item]: this.$translate.instant(
            `${translationPrefix}${
              toUpperSnakeCaseFlag
                ? this.constructor.toUpperSnakeCase(item)
                : item
            }`,
          ),
        }),
        {},
      ),
    };
  }

  loadServers() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(
      this.ouiDatagridService,
      'datagrids.dg-servers.paging.offset',
      currentOffset < this.paginationTotalCount
        ? currentOffset
        : this.paginationTotalCount,
    );

    return this.$q.resolve({
      data: this.dedicatedClusters?.data,
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  onPageChange({ pageSize, offset }) {
    this.onListParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onCriteriaChange($criteria) {
    const filter = $criteria.map((criteria) => ({
      field: criteria?.property || 'name',
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onListParamsChange({
      filter: JSON.stringify(filter),
    });
  }

  onSortChange({ name, order }) {
    this.onListParamsChange({
      sort: name,
      sortOrder: order,
    });
  }
}
