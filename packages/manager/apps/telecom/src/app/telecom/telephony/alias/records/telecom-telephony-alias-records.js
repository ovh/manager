angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.records', {
    url: '/records',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/records/telecom-telephony-alias-records.html',
        controller: 'TelecomTelephonyAliasRecordsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
