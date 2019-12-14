angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.tollfree-history',
    {
      url: '/tollfree-history',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/tollfreeHistory/telecom-telephony-billing-account-billing-tollfree-history.html',
          controller:
            'TelecomTelephonyBillingAccountBillingTollfreeHistoryCtrl',
          controllerAs: 'TollfreeHistoryCtrl',
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
  );
});
