angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.stats.ovhPabx',
      {
        url: '/ovhPabx',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/stats/ovhPabx/telecom-telephony-alias-configuration-stats-ovhPabx.html',
            controller: 'TelecomTelephonyAliasConfigurationStatsOvhPabxCtrl',
            controllerAs: 'StatsOvhPabxCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_configuration_stats_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
