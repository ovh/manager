angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.lines',
    {
      url: '/lines',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/lines/telecom-telephony-alias-configuration-lines.html',
          controller: 'TelecomTelephonyAliasConfigurationLinesCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
