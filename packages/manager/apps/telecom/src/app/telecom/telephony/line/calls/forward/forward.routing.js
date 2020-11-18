import template from './forward.html';
import controller from './forward.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.forward',
    {
      url: '/forward',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineForwardCtrl',
        },
      },
    },
  );
};
