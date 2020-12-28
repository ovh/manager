import template from './calls.html';
import controller from './calls.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls', {
    url: '/calls',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineCallsCtrl',
      },
    },
  });
};
