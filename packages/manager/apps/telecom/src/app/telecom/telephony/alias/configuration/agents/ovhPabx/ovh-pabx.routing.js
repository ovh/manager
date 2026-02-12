import template from './ovh-pabx.html';
import controller from './ovh-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.agents.ovhPabx',
    {
      url: '/ovhPabx',
      views: {
        '@telecom.telephony.billingAccount.alias.details.configuration': {
          template,
          controller,
          controllerAs: 'AgentsOvhPabxCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_configuration_agents_breadcrumb'),
      },
    },
  );
};
