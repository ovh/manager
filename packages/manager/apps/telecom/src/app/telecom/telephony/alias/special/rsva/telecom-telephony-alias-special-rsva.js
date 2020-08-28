angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.details.rsva', {
    url: '/rsva',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
        templateUrl:
          'app/telecom/telephony/alias/special/rsva/telecom-telephony-alias-special-rsva.html',
        controller: 'TelecomTelephonyAliasSpecialRsvaCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
