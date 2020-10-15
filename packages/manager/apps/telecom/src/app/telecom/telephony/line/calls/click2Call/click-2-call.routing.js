import template from './click-2-call.html';
import controller from './click-2-call.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.click2call', {
    url: '/click2call',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'Click2CallCtrl',
      },
    },
  });
};
