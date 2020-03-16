import { ERROR_STATUS } from '@ovh-ux/ng-ovh-order-tracking';
import maxBy from 'lodash/maxBy';

export default class ManagerHubBillingSummaryCtrl {
  /* @ngInject */
  constructor(RedirectionService) {
    this.RedirectionService = RedirectionService;
    this.ordersTrackingLink = RedirectionService.getURL('orders');
    this.ERROR_STATUS = ERROR_STATUS;
  }

  $onInit() {
    this.currentStatus = maxBy(this.order.history, 'date') || {
      date: this.order.date,
      label: 'custom_creation',
    };
    this.orderTrackingLink = this.RedirectionService.getURL('order', {
      orderId: this.order.orderId,
    });
  }

  refreshTile() {
    this.loading = true;
    return this.refresh()
      .then((order) => {
        this.order = order;
        this.orderTrackingLink = this.RedirectionService.getURL('order', {
          orderId: order.orderId,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
