import template from './time-condition.html';
import controller from './time-condition.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.timeCondition',
    {
      url: '/timeCondition',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
