import template from './display-number.html';
import controller from './display-number.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.line_displayNumber',
    {
      url: '/displayNumber',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'LineDisplayNumberCtrl',
        },
      },
    },
  );
};
