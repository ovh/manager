import template from './rma.html';
import controller from './rma.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.rma', {
    url: '/rma',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'RmaCtrl',
      },
    },
  });
};
