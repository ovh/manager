angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.lines', {
    url: '/lines',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/lines/telecom-telephony-alias-configuration-lines.html',
        controller: 'TelecomTelephonyAliasConfigurationLinesCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
