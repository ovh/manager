angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.portabilities', {
    url: '/portabilities',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/portability/portabilities/telecom-telephony-alias-portability-portabilities.html',
        controller: 'TelecomTelephonyAliasPortabilitiesCtrl',
        controllerAs: 'PortabilitiesCtrl',
      },
    },
    translations: ['.'],
  });
});
