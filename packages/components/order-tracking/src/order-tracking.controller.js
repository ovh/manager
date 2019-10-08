import angular from 'angular';
import find from 'lodash/find';
import get from 'lodash/get';

const ORDER_DEFAULT_HISTORY_LENGTH = 3;
const SECONDS = 1000;
const ORDER_DETAILS_POLLING_INTERVAL = 60 * SECONDS;
const ORDER_FOLLOW_UP_POLLING_INTERVAL = 60 * SECONDS;

export default class OrderTrackingController {
  /* @ngInject */
  constructor($log, $q, $timeout, OvhApiMeOrder) {
    this.$log = $log;
    this.$q = $q;
    this.$timeout = $timeout;
    this.OvhApiMeOrder = OvhApiMeOrder;
    this.maxHistoryLength = ORDER_DEFAULT_HISTORY_LENGTH;
  }

  $onInit() {
    return this.refresh();
  }

  refresh() {
    this.order = null;
    this.orderDetails = null;
    this.orderFollowUp = null;
    this.orderHistory = null;
    this.polling = {
      orderDetails: null,
      orderFollowUp: null,
    };
    this.error = null;
    this.isLoading = true;

    this.OvhApiMeOrder.v6().resetAllCache();
    this.cancelOrderDetailsPolling();
    this.cancelOrderFollowUpPolling();

    return this.OvhApiMeOrder.v6().get({
      orderId: this.orderId,
    }).$promise.then((order) => {
      this.order = order;
      this.pollOrderDetails(0);
      this.pollOrderFollowUp(0);
    }).catch((error) => {
      this.error = {
        message: (error.data || { message: error.statusText }).message,
      };
      if (angular.isFunction(error.headers)) {
        this.error.queryId = error.headers('x-ovh-queryid');
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  $onDestroy() {
    this.cancelOrderDetailsPolling();
    this.cancelOrderFollowUpPolling();
  }

  getOrderFollowUp() {
    return this.OvhApiMeOrder.v6().followUp({
      orderId: this.orderId,
    }).$promise;
  }

  getOrderDetails() {
    return this.OvhApiMeOrder.v6().getDetails({
      orderId: this.orderId,
    }).$promise.then(details => this.$q.all(details.map(id => this.OvhApiMeOrder.v6().getDetail({
      orderId: this.orderId,
      detailId: id,
    }).$promise)));
  }

  pollOrderFollowUp(interval = ORDER_FOLLOW_UP_POLLING_INTERVAL) {
    this.polling.orderFollowUp = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.getOrderFollowUp().then((followUp) => {
        this.orderFollowUp = followUp;
        this.orderHistory = get(find(followUp, { status: 'DOING' }), 'history');
      }).catch(this.$log).finally(() => {
        if (this.polling.orderFollowUp) {
          this.pollOrderFollowUp();
        }
      });
    }, interval * 1000);
  }

  pollOrderDetails(interval = ORDER_DETAILS_POLLING_INTERVAL) {
    this.polling.orderDetails = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.getOrderDetails().then((details) => {
        this.orderDetails = details;
      }).catch(this.$log).finally(() => {
        if (this.polling.orderDetails) {
          this.pollOrderDetails();
        }
      });
    }, interval * 1000);
  }

  cancelOrderDetailsPolling() {
    if (this.polling.orderDetails) {
      this.$timeout.cancel(this.polling.orderDetails);
      this.polling.orderDetails = null;
    }
  }

  cancelOrderFollowUpPolling() {
    if (this.polling.followUp) {
      this.$timeout.cancel(this.polling.followUp);
      this.polling.followUp = null;
    }
  }
}
