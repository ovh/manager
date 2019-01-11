angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billing.deposit', {
    url: '/deposit',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/deposit/telecom-telephony-billing-account-billing-deposit.html',
        controller: 'TelecomTelephonyBillingAccountBillingDepositCtrl',
        controllerAs: 'BillingDepositCtrl',
      },
    },
    translations: ['.'],
  });
});
