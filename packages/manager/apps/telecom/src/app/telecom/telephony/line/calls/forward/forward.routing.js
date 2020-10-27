import template from './forward.html';
import controller from './forward.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls.forward', {
    url: '/forward',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineForwardCtrl',
      },
    },
  });
};
