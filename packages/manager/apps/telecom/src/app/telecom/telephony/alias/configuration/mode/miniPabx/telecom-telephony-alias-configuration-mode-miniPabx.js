angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.mode.miniPabx',
    {
      url: '/miniPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/mode/miniPabx/telecom-telephony-alias-configuration-mode-miniPabx.html',
          controller: 'TelecomTelephonyAliasConfigurationModeMiniPabxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
