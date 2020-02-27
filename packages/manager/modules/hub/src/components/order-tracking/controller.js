import { ERROR_STATUS } from '@ovh-ux/ng-ovh-order-tracking';
import maxBy from 'lodash/maxBy';

export default class ManagerHubBillingSummaryCtrl {
  /* @ngInject */
  constructor(RedirectionService) {
    this.orderTrackingLink = RedirectionService.getURL('orders');
    this.ERROR_STATUS = ERROR_STATUS;
  }

  $onInit() {
    this.currentStatus = maxBy(this.order.history, 'date');
  }
}
