angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.agents.ovhPabx',
      {
        url: '/ovhPabx',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/agents/ovhPabx/telecom-telephony-alias-configuration-agents-ovhPabx.html',
            controller: 'TelecomTelephonyAliasConfigurationAgentsOvhPabxCtrl',
            controllerAs: 'AgentsOvhPabxCtrl',
          },
        },
        translations: { value: ['..'], format: 'json' },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_configuration_agents_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
