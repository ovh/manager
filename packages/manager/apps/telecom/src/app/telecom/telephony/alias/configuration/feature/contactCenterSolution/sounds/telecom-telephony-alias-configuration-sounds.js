angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.sounds',
    {
      url: '/sounds',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
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
