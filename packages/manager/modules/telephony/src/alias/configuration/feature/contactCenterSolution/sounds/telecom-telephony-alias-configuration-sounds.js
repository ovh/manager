angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.sounds', {
    url: '/sounds',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/sounds/telecom-telephony-alias-configuration-sounds.html',
        controller: 'TelecomTelephonyAliasConfigurationSoundsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.', '../..'],
  });
});
