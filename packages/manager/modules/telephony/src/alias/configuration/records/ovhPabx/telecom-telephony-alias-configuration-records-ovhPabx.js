angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.recordsOvhPabx', {
    url: '/ovhPabx/records',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/records/ovhPabx/telecom-telephony-alias-configuration-records-ovhPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationRecordsOvhPabxCtrl',
        controllerAs: 'RecordsOvhPabxCtrl',
      },
    },
    translations: ['.'],
  });
});
