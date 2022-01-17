import map from 'lodash/map';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { STATUS } from './cloud-connect.constants';

export default class CloudConnectCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    coreURLBuilder,
    iceberg,
    ouiDatagridService,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.iceberg = iceberg;
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

    this.orders = [];

    // Check if there is order to follow up
    this.getOrderFollowUp();
  }

  getOrderFollowUp() {
    return this.iceberg('/ovhCloudConnect/order')
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: result }) => {
        this.orders = map(result, (res) => {
          const orderBillingUrl = this.buildOrderBillingUrl(res.orderId);
          res.orderBillingUrl = orderBillingUrl;
          return res;
        });
        return result;
      });
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
