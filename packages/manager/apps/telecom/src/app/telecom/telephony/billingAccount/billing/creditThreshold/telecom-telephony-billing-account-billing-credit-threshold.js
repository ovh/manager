angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.creditThreshold', {
    url: '/creditThreshold',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/billing/creditThreshold/telecom-telephony-billing-account-billing-credit-threshold.html',
        controller: 'TelecomTelephonyBillingAccountBillingCreditThresholdCtrl',
        controllerAs: 'BillingAccountCreditThresholdCtrl',
      },
    },
    translations: { value: ['.', '..'], format: 'json' },
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
