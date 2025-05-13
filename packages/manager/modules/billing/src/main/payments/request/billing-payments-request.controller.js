export default class BillingHistoryRequestCtrl {
  /* @ngInject */
  constructor($state, BillingPaymentsRequest, Alerter) {
    this.$state = $state;
    this.BillingPaymentsRequest = BillingPaymentsRequest;
    this.Alerter = Alerter;

    this.bills = null;
    this.requestPending = true;

    this.loading = {
      init: false,
    };
  }

  $onInit() {
    this.loading.init = true;
    this.BillingPaymentsRequest.fetch()
      .then(({ depositRequests, bills }) => {
        this.requestPending = depositRequests.length > 0;
        this.bills = bills;
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('billing_payment_request_load_error'),
          {
            message: error.data?.message || error.message,
            type: 'ERROR',
          },
          'billing_payment_request',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
