import get from 'lodash/get';
import map from 'lodash/map';

import { NUMBER_COLUMN_OPTIONS, STRING_COLUMN_OPTIONS } from './constants';

export default class ListLayoutCtrl {
  /* @ngInject */
  constructor($q, ouiDatagridService) {
    this.$q = $q;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = `dg-${this.id}`;
    this.getDisplayedColumns(this.columns);
    this.dataNaviId = `${this.id}-list`;

    this.criteria = JSON.parse(this.filter).map((criteria) => ({
      property: get(criteria, 'field') || this.defaultFilterColumn,
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    this.stringColumnOptions = {
      operators: STRING_COLUMN_OPTIONS,
    };

    this.numberColumnOptions = {
      operators: NUMBER_COLUMN_OPTIONS,
    };
  }

  loadPage() {
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

  getDisplayedColumns(columns) {
    this.displayedColumns = columns
      ? JSON.stringify(
          map(
            columns.filter(({ hidden }) => !hidden),
            ({ name, property }) => name || property,
          ),
        )
      : [];
  }

  onPageChange({ pageSize, offset }) {
    this.onParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onCriteriaChange($criteria) {
    const filter = $criteria.map((criteria) => ({
      field: get(criteria, 'property') || this.defaultFilterColumn,
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onParamsChange({
      filter: JSON.stringify(filter),
    });
  }

  onSortChange({ name, order }) {
    this.onParamsChange({
      sort: name,
      sortOrder: order,
    });
  }

  onParamsChange(params) {
    return this.onListParamsChange({
      ...params,
      columns: this.displayedColumns,
    });
  }

  onColumnChange(id, columns) {
    this.getDisplayedColumns(columns);
    return this.onListParamsChange();
  }
}
