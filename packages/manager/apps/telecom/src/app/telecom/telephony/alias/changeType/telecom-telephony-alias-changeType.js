angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.changeType',
    {
      url: '/changeType',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/changeType/telecom-telephony-alias-changeType.html',
          controller: 'TelecomTelephonyAliasChangeTypeCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.', '../configuration'], format: 'json' },
    },
  );
});
