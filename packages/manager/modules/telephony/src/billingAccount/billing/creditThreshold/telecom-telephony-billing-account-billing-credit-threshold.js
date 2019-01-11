angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.creditThreshold', {
    url: '/creditThreshold',
    views: {
      'groupView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/creditThreshold/telecom-telephony-billing-account-billing-credit-threshold.html',
        controller: 'TelecomTelephonyBillingAccountBillingCreditThresholdCtrl',
        controllerAs: 'BillingAccountCreditThresholdCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
