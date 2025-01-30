import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { STATUS } from './cloud-connect.constants';

export default class CloudConnectCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    coreURLBuilder,
    ouiDatagridService,
    constants,
    cloudConnectService,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.constants = constants;
    this.cloudConnectService = cloudConnectService;
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

  loadPage({ offset, pageSize }) {
    return this.cloudConnectService
      .getOvhCloudConnect((offset - 1) / pageSize + 1, pageSize)
      .then(({ data }) => {
        return this.$q.all(
          data.map((ovhCloudConnect) => {
            return this.cloudConnectService
              .getCloudConnectNotifications(ovhCloudConnect.uuid)
              .then((notifications) => {
                const numOfActiveNotifications = notifications.filter(
                  (notification) => notification.activated,
                ).length;
                return {
                  ...ovhCloudConnect,
                  activeNotfications: `${numOfActiveNotifications}/${notifications.length}`,
                };
              });
          }),
        );
      })
      .then((result) => {
        return {
          data: result,
          meta: {
            totalCount: result.length,
          },
        };
      });
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
