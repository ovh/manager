angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.changeType', {
    url: '/changeType',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/changeType/telecom-telephony-alias-changeType.html',
        controller: 'TelecomTelephonyAliasChangeTypeCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.', '../configuration'], format: 'json' },
  });
});
