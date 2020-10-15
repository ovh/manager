import template from './assist.html';
import controller from './assist.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist', {
    url: '/assist',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineAssistCtrl',
      },
    },
  });
};
