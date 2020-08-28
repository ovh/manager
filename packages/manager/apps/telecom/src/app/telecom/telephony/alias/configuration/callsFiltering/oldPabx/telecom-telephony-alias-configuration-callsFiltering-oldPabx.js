angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.callsFiltering.oldPabx',
    {
      url: '/oldPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/callsFiltering/oldPabx/telecom-telephony-alias-configuration-callsFiltering-oldPabx.html',
          controller:
            'TelecomTelephonyAliasConfigurationCallsFilteringOldPabxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
