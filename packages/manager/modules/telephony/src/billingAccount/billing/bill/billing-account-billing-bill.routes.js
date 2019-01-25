export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.bill', {
    url: '/bill',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/billing/bill/telecom-telephony-billing-account-billing-bill.html',
        controller: 'TelecomTelephonyBillingAccountBillingBillCtrl',
        controllerAs: 'BillingAccountBillCtrl',
      },
    },
    translations: ['.'],
  });
};
