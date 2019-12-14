angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.repayment-history',
    {
      url: '/repayment-history',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/repaymentHistory/telecom-telephony-billing-account-billing-repayment-history.html',
          controller:
            'TelecomTelephonyBillingAccountBillingRepaymentHistoryCtrl',
          controllerAs: 'RepaymentHistoryCtrl',
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
