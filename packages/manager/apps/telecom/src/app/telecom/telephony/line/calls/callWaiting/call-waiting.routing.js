import template from './call-waiting.html';
import controller from './call-waiting.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.callWaiting',
    {
      url: '/callWaiting',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'LineCallWaitingCtrl',
        },
      },
    },
  );
};
