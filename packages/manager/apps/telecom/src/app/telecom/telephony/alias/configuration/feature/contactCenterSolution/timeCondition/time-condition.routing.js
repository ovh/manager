import template from './time-condition.html';
import controller from './time-condition.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.timeCondition',
    {
      url: '/timeCondition',
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
