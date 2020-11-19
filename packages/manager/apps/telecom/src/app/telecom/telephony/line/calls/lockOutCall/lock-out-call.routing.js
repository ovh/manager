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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_actions_line_calls_lock_out_call_title',
          ),
      },
    },
  );
};
