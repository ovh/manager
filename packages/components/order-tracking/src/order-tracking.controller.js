import angular from 'angular';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import reverse from 'lodash/reverse';

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
    }).$promise.then(order => this.getOrderStatus(order).then(({ status }) => {
      const orderWithStatus = order;
      orderWithStatus.status = status;
      return orderWithStatus;
    })).then((order) => {
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

  getOrderStatus() {
    return this.OvhApiMeOrder.v6().getStatus({
      orderId: this.orderId,
    }).$promise;
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
        this.orderHistory = reverse(flatten(map(followUp, follow => reverse(follow.history))));
        if (this.order.status === 'notPaid' && this.orderHistory.length === 0) {
          this.orderHistory.push({
            date: this.order.date,
            label: 'custom_payment_waiting',
          });
        }
        this.orderHistory.push({
          date: this.order.date,
          label: 'custom_creation',
        });
      }).catch((err) => {
        // 404 is returned for older orders that does not contains followUp and history
        if (err.status === 404) {
          this.orderFollowUp = {};
          this.orderHistory = [];
        } else {
          this.$log.error(err);
        }
      }).finally(() => {
        if (this.polling.orderFollowUp) {
          this.pollOrderFollowUp();
        }
      });
    }, interval);
  }

  pollOrderDetails(interval = ORDER_DETAILS_POLLING_INTERVAL) {
    this.polling.orderDetails = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.getOrderDetails().then((details) => {
        this.orderDetails = details;
      }).catch(err => this.$log.error(err)).finally(() => {
        if (this.polling.orderDetails) {
          this.pollOrderDetails();
        }
      });
    }, interval);
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
