import {
  WAITING_PAYMENT_LABEL,
  ERROR_STATUS,
} from '@ovh-ux/ng-ovh-order-tracking';
import { maxBy } from 'lodash-es';

export default class ManagerHubBillingSummaryCtrl {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.coreURLBuilder = coreURLBuilder;
    this.ordersTrackingLink = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/orders',
    );
    this.ERROR_STATUS = ERROR_STATUS;
  }

  $onInit() {
    this.currentStatus = maxBy(this.order.history, 'date') || {
      date: this.order.date,
      label:
        this.order.status === 'delivered'
          ? 'INVOICE_IN_PROGRESS'
          : 'custom_creation',
    };
    this.orderTrackingLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/order/:orderId',
      {
        orderId: this.order.orderId,
      },
    );

    if (this.currentStatus.label === WAITING_PAYMENT_LABEL) {
      this.isWaitingPayment = true;
    }
  }

  refreshTile() {
    this.loading = true;
    return this.refresh()
      .then((order) => {
        this.order = order;
        this.orderTrackingLink = this.coreURLBuilder.buildURL(
          'dedicated',
          '#/billing/order/:orderId',
          { orderId: order.orderId },
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
