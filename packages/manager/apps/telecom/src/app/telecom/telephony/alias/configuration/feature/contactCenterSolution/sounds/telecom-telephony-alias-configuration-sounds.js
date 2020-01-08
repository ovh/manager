angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.sounds',
    {
      url: '/sounds',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/sounds/telecom-telephony-alias-configuration-sounds.html',
          controller: 'TelecomTelephonyAliasConfigurationSoundsCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.', '../..'], format: 'json' },
    },
  );
});
