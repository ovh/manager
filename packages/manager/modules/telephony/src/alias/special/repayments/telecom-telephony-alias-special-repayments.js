angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.repayments', {
    url: '/repayments',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/special/repayments/telecom-telephony-alias-special-repayments.html',
        controller: 'TelecomTelephonyAliasSpecialRepaymentsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
