import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { STATUS } from './cloud-connect.constants';

export default class CloudConnectCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $http, $translate, coreURLBuilder, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.datagridId = 'dg-cloudconnect';
    this.defaultFilterColumn = 'uuid';

    super.$onInit();

    this.status = STATUS;
    this.PROVIDER_OVH_CLOUD = 'OVHcloud';

    this.columnsConfig = [
      { name: 'uuid', sortable: this.getSorting('uuid') },
      {
        name: 'description',
        sortable: this.getSorting('description'),
      },
      { name: 'pop', sortable: this.getSorting('pop') },
      { name: 'vrack', sortable: this.getSorting('vrack') },
      { name: 'status', sortable: this.getSorting('status') },
    ];

    // Check if there is order to follow up
    this.orders = this.orderFollowUp.map((order) => ({
      ...order,
      orderBillingUrl: this.buildOrderBillingUrl(order.orderId),
    }));
  }

  static isWarning(value) {
    return ['creating', 'toCreate', 'toDelete'].includes(value);
  }

  static isError(value) {
    return ['deleted', 'suspended'].includes(value);
  }

  static formatDate(dateTime) {
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  buildOrderBillingUrl(orderId) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/orders/:orderId',
      {
        orderId,
      },
    );
  }
}
