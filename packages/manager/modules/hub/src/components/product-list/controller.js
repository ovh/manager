import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import get from 'lodash/get';

export default class ManagerHubBillingProductList extends ListLayoutHelper.ListLayoutCtrl {
  $onInit() {
    this.datagridId = `dg-${this.productType}`;
    this.defaultFilterColumn = this.propertyId;

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
}
