export default class TelephonyLineOrderShippingCtrl {
  /* @ngInject */
  constructor($scope, atInternet) {
    this.$scope = $scope;
    this.atInternet = atInternet;
  }

  back() {
    if (!this.phone) {
      this.track(
        'telecom::telephony::billingAccount::line::phone::order::delivery::previous',
      );
    } else {
      this.track(
        'telecom::telephony::billingAccount::line::phone::change::delivery::previous',
      );
    }

    this.$scope.$emit('hardwareFromShipping');
  }

  next() {
    this.atInternet.trackPage({
      name: 'telecom::telephony::billingAccount::line::phone::order::summary',
    });
    if (!this.phone) {
      this.track(
        'telecom::telephony::billingAccount::line::phone::order::delivery::next',
      );
    } else {
      this.track(
        'telecom::telephony::billingAccount::line::phone::change::delivery::next',
      );
    }
    this.$scope.$emit('summaryFromShipping', this.order);
  }

  track(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
