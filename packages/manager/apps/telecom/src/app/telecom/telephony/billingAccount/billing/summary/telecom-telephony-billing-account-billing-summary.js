angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.summary', {
    url: '/summary',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/summary/telecom-telephony-billing-account-billing-summary.html',
        controller: 'TelecomTelephonyBillingAccountBillingSummaryCtrl',
        controllerAs: 'SummaryCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
