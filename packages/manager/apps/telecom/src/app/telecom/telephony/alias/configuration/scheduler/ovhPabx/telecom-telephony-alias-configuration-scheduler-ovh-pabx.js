angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.schedulerOvhPabx',
      {
        url: '/ovhPabx/scheduler',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/scheduler/ovhPabx/telecom-telephony-alias-configuration-scheduler-ovh-pabx.html',
            controller:
              'TelecomTelephonyAliasConfigurationSchedulerOvhPabxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_config_contactCenterSolution_scheduler_breadcrumb',
            ),
        },
        translations: { value: ['..'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
