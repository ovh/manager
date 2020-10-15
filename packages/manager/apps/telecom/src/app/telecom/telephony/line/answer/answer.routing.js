import template from './answer.html';
import controller from './answer.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.answer', {
    url: '/answer',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineAnswerCtrl',
      },
    },
  });
};
