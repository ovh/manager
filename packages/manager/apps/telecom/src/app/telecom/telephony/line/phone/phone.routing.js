import template from './phone.html';
import controller from './phone.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone', {
    url: '/phone',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
