angular
  .module('managerApp')
  .component('telecomTelephonyBillingAccountOrderAliasIdentity', {
    templateUrl:
      'app/telecom/telephony/account/billingAccount/orderAlias/identity/telecom-telephony-group-v4-billing-account-orderAlias-identity.html',
    bindings: {
      ngModel: '=?',
      ngDisabled: '=?',
      organisation: '@',
    },
    controller(tucValidator) {
      this.validator = tucValidator;
    },
  });
