export default /* @ngInject */ function BillingOrderRetractionCtrl(
  $log,
  $translate,
  $http,
  Alerter,
  goToOrders,
  orderId,
) {
  this.goToOrders = goToOrders;
  this.orderId = orderId;
  this.loading = false;

  this.retract = () => {
    this.success = false;
    this.loading = true;
    return $http
      .post(`/me/order/${orderId}/retraction`, {
        reason: 'other',
      })
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
