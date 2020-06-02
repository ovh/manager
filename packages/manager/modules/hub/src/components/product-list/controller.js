import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { get, map } from 'lodash-es';

export default class ManagerHubBillingProductList extends ListLayoutHelper.ListLayoutCtrl {
  $onInit() {
    this.datagridId = `dg-${this.productType}`;
    this.defaultFilterColumn = this.propertyId;

    this.getDisplayedColumns(this.columns);

    super.$onInit();
  }

  loadStaticRows() {
    return this.loadPage().then(({ meta }) => {
      const offset = get(
        this.ouiDatagridService,
        `datagrids.${this.datagridId}.paging.offset`,
      );
      // $q is injected in super controller
      return this.$q.resolve({
        data: this.rows.slice(
          offset - 1,
          offset + parseInt(this.paginationSize, 10),
        ),
        meta,
      });
    });
  }

  onListParamsChange(params) {
    // workaround to prevent uirouter from resetting columns parameter as it is dynamic
    return this.onParamsChange({
      ...params,
      columns: this.displayedColumns,
    });
  }

  getDisplayedColumns(columns) {
    this.displayedColumns = JSON.stringify(
      map(
        columns.filter(({ hidden }) => !hidden),
        ({ name, property }) => name || property,
      ),
    );
  }

  onColumnChange(id, columns) {
    this.getDisplayedColumns(columns);
    return this.onListParamsChange();
  }
}
