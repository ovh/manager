import template from './time-condition.html';
import controller from './time-condition.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.timeCondition',
    {
      url: '/timeCondition',
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
            'telephony_alias_config_contactCenterSolution_timeCondition',
          ),
      },
    },
  );
};
