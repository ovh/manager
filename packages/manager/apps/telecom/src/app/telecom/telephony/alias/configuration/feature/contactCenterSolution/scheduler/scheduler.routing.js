import template from './scheduler.html';
import controller from './scheduler.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.timeCondition.scheduler',
    {
      url: '/scheduler',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_alias_config_contactCenterSolution_scheduler_title',
          ),
      },
    },
  );
};
