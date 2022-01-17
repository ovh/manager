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
    return this.$http.get('/ovhCloudConnect/order').then((res) => {
      map(res.data, (orderName) => {
        this.getOrderDetail(orderName).then((result) => {
          const order = result;
          const orderBillingUrl = this.buildOrderBillingUrl(order.orderId);
          order.orderBillingUrl = orderBillingUrl;
          this.orders.push(order);
          return result;
        });
      });
    });
  }

  getOrderDetail(orderName) {
    return this.$http
      .get(`/ovhCloudConnect/order/${orderName}`)
      .then(({ data }) => data);
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
