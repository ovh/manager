angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.mode.easyPabx',
    {
      url: '/easyPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/mode/easyPabx/telecom-telephony-alias-configuration-mode-easyPabx.html',
          controller: 'TelecomTelephonyAliasConfigurationModeEasyPabxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
