export default /* @ngInject */ function BillingPaymentDetailsCtrl(
  $q,
  $state,
  $stateParams,
  $translate,
  Alerter,
  BillingPayments,
) {
  this.paymentId = $stateParams.id;
  this.payment = {};

  this.loadBills = ({ offset, pageSize }) =>
    BillingPayments.getBillsIds($stateParams.id).then((ids) => ({
      data: ids.slice(offset - 1, offset - 1 + pageSize).map((id) => ({ id })),
      meta: {
        totalCount: ids.length,
      },
    }));

  this.loadDetails = ({ id }) =>
    BillingPayments.getBillDetails($stateParams.id, id);

  this.paymentsHref = () => $state.href('app.account.billing.main.payments');

  this.$onInit = () =>
    BillingPayments.getPayment($stateParams.id)
      .then((payment) => {
        this.payment = payment;
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('payments_error'), err.data);
        return $q.reject(err);
      });
}
