angular.module('managerApp').config(($stateProvider) =>
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.groupRepayments',
    {
      url: '/groupRepayments',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/groupRepayments/telecom-telephony-billing-account-billing-group-repayments.html',
          controller:
            'TelecomTelephonyBillingAccountBillingGroupRepaymentsCtrl',
          controllerAs: 'GroupRepaymentsCtrl',
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
    },
  ),
);
