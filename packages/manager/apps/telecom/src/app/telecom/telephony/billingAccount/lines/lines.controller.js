import get from 'lodash/get';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';

export default class TelecomTelephonyBillingAccountLinesController {
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
    this.defaultFilterColumn = 'description';

    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: get(criteria, 'field') || this.defaultFilterColumn,
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    // this.stateEnumFilter = this.getEnumFilter(this.serverStateEnum,
    // 'server_configuration_state_');
    // this.datacenterEnumFilter = this.getEnumFilter(this.datacenterEnum, 'server_datacenter_');

    this.columnsConfig = [
      { name: 'description', sortable: this.getSorting('description') },
      // { name: 'reverse', sortable: this.getSorting('reverse') },
      // { name: 'commercialRange', sortable: this.getSorting('commercialRange') },
      // { name: 'datacenter', sortable: this.getSorting('datacenter') },
      // { name: 'state', sortable: this.getSorting('state') },
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
          [item]: this.$translate.instant(`${translationPrefix}${this.constructor.toUpperSnakeCase(item)}`),
        }),
        {},
      ),
    };
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder.toLowerCase() : '';
  }

  loadPage() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(this.ouiDatagridService, 'datagrids.dg-telephony-billingAccounts-lines.paging.offset', currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount);

    return this.$q.resolve({
      data: get(this.resources, 'data'),
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
      field: get(criteria, 'property') || this.defaultFilterColumn,
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
