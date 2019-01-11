angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billing', {
    url: '/billing',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/telecom-telephony-billing-account-billing.html',
        controller: 'TelecomTelephonyBillingAccountBillingCtrl',
        controllerAs: 'GroupBillingCtrl',
      },
    },
    translations: ['.'],
  });
});
