angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.bill', {
    url: '/bill',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/bill/telecom-telephony-billing-account-billing-bill.html',
        controller: 'TelecomTelephonyBillingAccountBillingBillCtrl',
        controllerAs: 'BillingAccountBillCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
    redirectTo: (transition) =>
      transition
        .injector()
        .get('TelephonyMediator')
        .getGroup(transition.params().billingAccount)
        .then((group) =>
          group.isNicAdmin || group.isNicBilling
            ? false
            : 'telecom.telephony.billingAccount',
        ),
  });
});
