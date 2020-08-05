angular
  .module('managerApp')
  .config(($stateProvider) => {
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
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_alias_configuration_records_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
