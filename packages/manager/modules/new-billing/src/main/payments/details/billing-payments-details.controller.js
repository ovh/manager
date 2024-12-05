export default class BillingPaymentDetailsCtrl {
  /* @ngInject */
  constructor($q, $state, $stateParams, $translate, Alerter, BillingPayments) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.BillingPayments = BillingPayments;
    this.paymentId = $stateParams.id;
    this.payment = {};
  }

  $onInit() {
    return this.BillingPayments.getPayment(this.paymentId)
      .then((payment) => {
        this.payment = payment;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('payments_error'),
          err.data,
        );
        return this.$q.reject(err);
      });
  }

  loadBills({ offset, pageSize }) {
    return this.BillingPayments.getBills(this.paymentId, {
      offset,
      pageSize,
    });
  }

  loadDetails(bill) {
    return this.BillingPayments.getBillDetails(this.paymentId, bill);
  }

  paymentsHref() {
    return this.$state.href('billing.main.payments');
  }
}
