export default /* @ngInject */ function BillingOrderRetractionCtrl(
  $log,
  $translate,
  Alerter,
  BillingOrders,
  goToOrders,
  orderId,
) {
  this.goToOrders = goToOrders;
  this.orderId = orderId;
  this.loading = false;

  this.retract = () => {
    this.success = false;
    this.loading = true;
    return BillingOrders.retractOrder(orderId)
      .then(() => {
        this.success = true;
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('orders_retract_error'), err);
        $log.error(err);
      })
      .finally(() => {
        this.loading = false;
      });
  };
}
