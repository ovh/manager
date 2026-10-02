export default class BillingCommitmentEntryCtrl {
  /* @ngInject */
  constructor($state, $http, $log, orderId, ordersFilter) {
    this.$state = $state;
    this.$http = $http;
    this.$log = $log;
    this.orderId = orderId;
    this.ordersFilter = ordersFilter;
    this.commitmentNumber = null;
    this.loading = false;
    this.error = null;
    this.success = false;
  }

  goToOrders() {
    this.$state.go('billing.orders.orders', {
      filter: this.ordersFilter,
    });
  }

  submit() {
    this.loading = true;
    this.error = null;

    return this.$http
      .put(`/me/order/${this.orderId}/engagementNumber`, {
        engagementNumber: this.commitmentNumber.trim(),
      })
      .then(() => {
        this.success = true;
      })
      .catch((err) => {
        this.error = true;
        this.$log.error(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
