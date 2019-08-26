angular.module('managerApp').component('telecomTelephonyBillingAccountOrderAliasNumberChoice', {
  templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/numberChoice/telecom-telephony-billing-account-orderAlias-numberChoice.html',
  bindings: {
    ngModel: '=?',
    choices: '=?',
    prices: '=?',
    ngDisabled: '=?',
    type: '@',
    billingAccount: '@',
    name: '@',
  },
});
