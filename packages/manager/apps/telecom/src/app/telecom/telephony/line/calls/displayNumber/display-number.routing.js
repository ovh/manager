import template from './display-number.html';
import controller from './display-number.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.line_displayNumber',
    {
      url: '/displayNumber',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineDisplayNumberCtrl',
        },
      },
    },
  );
};
