angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing', {
    url: '/billing',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/telecom-telephony-billing-account-billing.html',
        controller: 'TelecomTelephonyBillingAccountBillingCtrl',
        controllerAs: 'GroupBillingCtrl',
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
