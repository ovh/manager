angular
  .module('managerApp')
  .component('telecomTelephonyBillingAccountOrderAliasCoordinate', {
    templateUrl:
      'app/telecom/telephony/billingAccount/orderAlias/coordinate/telecom-telephony-billing-account-orderAlias-coordinate.html',
    bindings: {
      ngModel: '=?',
      ngDisabled: '=?',
      regionCode: '@',
      hideChoice: '=?',
    },
    controller(tucValidator) {
      this.validator = tucValidator;
    },
  });
