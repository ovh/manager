angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.recordsOvhPabx',
    {
      url: '/ovhPabx/records',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/records/ovhPabx/telecom-telephony-alias-configuration-records-ovhPabx.html',
          controller: 'TelecomTelephonyAliasConfigurationRecordsOvhPabxCtrl',
          controllerAs: 'RecordsOvhPabxCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
