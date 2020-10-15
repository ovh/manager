import template from './external-number.html';
import controller from './external-number.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.externalNumber',
    {
      url: '/externalNumber',
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
