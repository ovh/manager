import template from './external-number.html';
import controller from './external-number.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.externalNumber',
    {
      url: '/externalNumber',
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
