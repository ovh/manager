import template from './call-waiting.html';
import controller from './call-waiting.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.callWaiting',
    {
      url: '/callWaiting',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineCallWaitingCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_actions_line_calls_call_waiting_title',
          ),
      },
    },
  );
};
