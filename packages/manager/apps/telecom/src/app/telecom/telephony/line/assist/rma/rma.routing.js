import template from './rma.html';
import controller from './rma.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.assist.rma',
    {
      url: '/rma',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'RmaCtrl',
        },
      },
    },
  );
};
