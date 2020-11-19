import template from './calls.html';
import controller from './calls.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls',
    {
      url: '/calls',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineCallsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_calls_breadcrumb'),
      },
    },
  );
};
