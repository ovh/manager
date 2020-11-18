import template from './lock-out-call.html';
import controller from './lock-out-call.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.lockOutCall',
    {
      url: '/lockOutCall',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineLockOutCallCtrl',
        },
      },
    },
  );
};
