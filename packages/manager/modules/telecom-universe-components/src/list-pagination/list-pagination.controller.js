import get from 'lodash/get';
import set from 'lodash/set';

export default class ListPaginationCtrl {
  $onInit() {
    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: get(criteria, 'field') || this.defaultFilterColumn,
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));
  }

  loadPage() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(
      this.ouiDatagridService,
      `datagrids.${this.datagridId}.paging.offset`,
      currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount,
    );

    return this.$q.resolve({
      data: get(this.resources, 'data'),
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder.toLowerCase() : '';
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
