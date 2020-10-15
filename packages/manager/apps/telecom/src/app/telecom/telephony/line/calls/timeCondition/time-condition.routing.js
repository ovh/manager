import template from './time-condition.html';
import controller from './time-condition.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.timeCondition',
    {
      url: '/timeCondition',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
