angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.administration', {
    url: '/administration',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/administration/telecom-telephony-alias-administration.html',
        controller: 'TelecomTelephonyAliasAdministrationCtrl',
        controllerAs: 'AliasAdministrationCtrl',
      },
    },
    translations: ['.'],
  });
});
