import angular from 'angular';

const ORDER_DEFAULT_HISTORY_LENGTH = 3;
const SECONDS = 1000;
const ORDER_DETAILS_POLLING_INTERVAL = 60 * SECONDS;
const ORDER_FOLLOW_UP_POLLING_INTERVAL = 60 * SECONDS;

export default class OvhOrderTrackingController {
  /* @ngInject */
  constructor(
    $log,
    $q,
    $timeout,
    atInternet,
    coreConfig,
    coreURLBuilder,
    OrderTracking,
    OvhApiMeOrder,
    RedirectionService,
  ) {
    this.$log = $log;
    this.$q = $q;
    this.$timeout = $timeout;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.OrderTracking = OrderTracking;
    this.OvhApiMeOrder = OvhApiMeOrder;
    this.RedirectionService = RedirectionService;
    this.maxHistoryLength = ORDER_DEFAULT_HISTORY_LENGTH;
  }

  $onInit() {
    this.HELP_URL = this.RedirectionService.getURL('help', {
      ovhSubsidiary: this.coreConfig.getUser().ovhSubsidiary,
    });
    this.PAYMENT_METHOD_URL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method',
    );
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

    return this.OvhApiMeOrder.v6()
      .get({
        orderId: this.orderId,
      })
      .$promise.then((order) =>
        this.OrderTracking.getOrderStatus(order).then((status) => {
          this.trackPage(status);
          const orderWithStatus = order;
          orderWithStatus.status = status;
          return orderWithStatus;
        }),
      )
      .then((order) => {
        this.order = order;
        this.pollOrderDetails(0);
        this.pollOrderFollowUp(0);
      })
      .catch((error) => {
        this.error = {
          message: (error.data || { message: error.statusText }).message,
        };
        if (angular.isFunction(error.headers)) {
          this.error.queryId = error.headers('x-ovh-queryid');
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  $onDestroy() {
    this.cancelOrderDetailsPolling();
    this.cancelOrderFollowUpPolling();
  }

  pollOrderFollowUp(interval = ORDER_FOLLOW_UP_POLLING_INTERVAL) {
    this.polling.orderFollowUp = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.OrderTracking.getCompleteHistory(this.order)
        .then(({ followUp, history }) => {
          this.orderFollowUp = followUp;
          this.orderHistory = history;
          this.orderHistory.push({
            date: this.order.date,
            label: 'custom_creation',
          });
        })
        .finally(() => {
          if (this.polling.orderFollowUp) {
            this.pollOrderFollowUp();
          }
        });
    }, interval);
  }

  pollOrderDetails(interval = ORDER_DETAILS_POLLING_INTERVAL) {
    this.polling.orderDetails = this.$timeout(() => {
      this.OvhApiMeOrder.v6().resetAllCache();
      this.OrderTracking.getOrderDetails(this.order)
        .then((details) => {
          this.orderDetails = details;
        })
        .catch((err) => this.$log.error(err))
        .finally(() => {
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

  trackPage(orderStatus) {
    return this.atInternet.trackPage({
      name: 'order',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
      ...(orderStatus ? { orderStatus } : {}),
    });
  }
}
