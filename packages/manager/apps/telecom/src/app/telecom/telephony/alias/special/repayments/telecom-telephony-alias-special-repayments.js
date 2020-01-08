angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.repayments', {
    url: '/repayments',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl:
          'app/telecom/telephony/alias/special/repayments/telecom-telephony-alias-special-repayments.html',
        controller: 'TelecomTelephonyAliasSpecialRepaymentsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
