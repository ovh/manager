angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.queues.ovhPabx',
      {
        url: '/ovhPabx',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/queues/ovhPabx/telecom-telephony-alias-configuration-queues-ovhPabx.html',
            controller: 'TelecomTelephonyAliasConfigurationQueuesOvhPabxCtrl',
            controllerAs: 'QueuesOvhPabxCtrl',
          },
        },
        translations: { value: ['..', './hunting-sounds'], format: 'json' },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_configuration_queues_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
