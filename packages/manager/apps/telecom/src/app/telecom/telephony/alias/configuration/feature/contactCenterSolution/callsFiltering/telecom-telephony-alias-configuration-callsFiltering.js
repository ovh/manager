angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.callsFiltering', {
    url: '/callsFiltering',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/callsFiltering/telecom-telephony-alias-configuration-callsFiltering.html',
        controller: 'TelecomTelephonyAliasConfigurationCallsFilteringCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
