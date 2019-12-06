angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.rsva', {
    url: '/rsva',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/alias/special/rsva/telecom-telephony-alias-special-rsva.html',
        controller: 'TelecomTelephonyAliasSpecialRsvaCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
