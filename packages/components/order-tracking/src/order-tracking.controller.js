import { ORDER_DETAILS_POLLING_INTERVAL } from './order-tracking.config';

export default class OrderTrackingController {
  /* @ngInject */
  constructor($q, $timeout, OvhApiMeOrder) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.OvhApiMeOrder = OvhApiMeOrder;
  }

  $onInit() {
    return this.refresh();
  }

  refresh() {
    this.order = null;
    this.orderDetails = null;
    this.polling = {
      orderDetails: null,
    };
    this.error = null;
    this.isLoading = true;

    this.OvhApiMeOrder.v6().resetAllCache();
    this.cancelOrderDetailsPolling();

    return this.OvhApiMeOrder.v6().get({
      orderId: this.orderId,
    }).$promise.then((order) => {
      this.order = order;
      this.pollOrderDetails(0);
    }).catch((error) => {
      this.error = {
        message: (error.data || { message: error.statusText }).message,
        queryId: error.headers('x-ovh-queryid'),
      };
    }).finally(() => {
      this.isLoading = false;
    });
  }

  $onDestroy() {
    this.cancelOrderDetailsPolling();
  }

  getOrderDetails() {
    return this.OvhApiMeOrder.v6().getDetails({
      orderId: this.orderId,
    }).$promise.then(details => this.$q.all(details.map(id => this.OvhApiMeOrder.v6().getDetail({
      orderId: this.orderId,
      detailId: id,
    }).$promise)));
  }

  pollOrderDetails(interval = ORDER_DETAILS_POLLING_INTERVAL) {
    const SECONDS_TO_MS = 1000;
    this.polling.orderDetails = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.getOrderDetails().then((details) => {
        this.orderDetails = details;
      }).finally(() => {
        if (this.polling.orderDetails) {
          this.pollOrderDetails();
        }
      });
    }, interval * SECONDS_TO_MS);
  }

  cancelOrderDetailsPolling() {
    if (this.polling.orderDetails) {
      this.$timeout.cancel(this.polling.orderDetails);
      this.polling.orderDetails = null;
    }
  }
}
