angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.sounds',
    {
      url: '/sounds',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/ovhPabx/sounds/telecom-telephony-alias-configuration-ovhPabx-sounds.html',
          controller: 'TelecomTelephonyAliasConfigurationOvhPabxSoundsCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
