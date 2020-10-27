import template from './scheduler.html';
import controller from './scheduler.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.timeCondition.scheduler',
    {
      url: '/scheduler',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
