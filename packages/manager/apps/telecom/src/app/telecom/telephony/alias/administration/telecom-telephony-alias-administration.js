angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.administration', {
    url: '/administration',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/alias/administration/telecom-telephony-alias-administration.html',
        controller: 'TelecomTelephonyAliasAdministrationCtrl',
        controllerAs: 'AliasAdministrationCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
