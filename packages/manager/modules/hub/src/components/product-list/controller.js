import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class ManagerHubBillingProductList extends ListLayoutHelper.ListLayoutCtrl {
  $onInit() {
    this.datagridId = `dg-${this.productType}`;

    super.$onInit();
  }
}
