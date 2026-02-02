import template from './ovh-pabx.html';
import controller from './ovh-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.schedulerOvhPabx',
    {
      url: '/ovhPabx/scheduler',
      views: {
        '@telecom.telephony.billingAccount.alias.details.configuration': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_alias_config_contactCenterSolution_scheduler_breadcrumb',
          ),
      },
    },
  );
};
