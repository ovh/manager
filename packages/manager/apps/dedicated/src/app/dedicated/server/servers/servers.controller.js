import get from 'lodash/get';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

export default class ServersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: get(criteria, 'field') || 'name',
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    this.stateEnumFilter = this.getEnumFilter(this.serverStateEnum, 'server_configuration_state_');
    this.datacenterEnumFilter = this.getEnumFilter(this.datacenterEnum, 'server_datacenter_');
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
          [item]: this.$translate.instant(`${translationPrefix}${this.constructor.toUpperSnakeCase(item)}`),
        }),
        {},
      ),
    };
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder : '';
  }

  loadServers() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(this.ouiDatagridService, 'datagrids.dg-servers.paging.offset', currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount);

    return this.$q.resolve({
      data: get(this.dedicatedServers, 'data'),
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
    const filter = $criteria.map(criteria => ({
      field: get(criteria, 'property') || 'name',
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
