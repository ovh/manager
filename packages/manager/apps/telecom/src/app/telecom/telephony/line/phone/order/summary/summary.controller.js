export default class TelephonyLineOrderSummaryCtrl {
  /* @ngInject */
  constructor($scope, atInternet) {
    this.$scope = $scope;
    this.atInternet = atInternet;
  }

  backShipping() {
    this.$scope.$emit('shippingFromSummary', this.order);
    if (!this.phone) {
      this.track(
        'telecom::telephony::billingAccount::line::phone::order::summary::previous',
      );
    } else {
      this.track(
        'telecom::telephony::billingAccount::line::phone::change::summary::previous',
      );
    }
  }

  submitOrder() {
    this.isSubmiting = true;
    this.$scope.$emit('submitOrder', this.order);
    if (!this.phone) {
      this.track(
        'telecom::telephony::billingAccount::line::phone::order::summary::validate',
      );
    } else {
      this.track(
        'telecom::telephony::billingAccount::line::phone::change::summary::validate',
      );
    }
  }

  track(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
