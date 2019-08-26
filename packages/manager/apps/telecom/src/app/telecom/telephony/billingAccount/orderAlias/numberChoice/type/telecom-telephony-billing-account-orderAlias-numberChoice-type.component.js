angular.module('managerApp').component('telecomTelephonyBillingAccountOrderAliasNumberChoiceType', {
  templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/numberChoice/type/telecom-telephony-billing-account-orderAlias-numberChoice-type.html',
  bindings: {
    loading: '=?',
    radioModel: '=?',
    numberModel: '=?',
    radioValue: '@',
    title: '@',
    price: '@',
    choices: '=?',
    ngDisabled: '=?',
    name: '@',
  },
});
