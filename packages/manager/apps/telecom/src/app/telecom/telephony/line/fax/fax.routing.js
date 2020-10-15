import template from './fax.html';
import controller from './fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax', {
    url: '/fax',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineFaxCtrl',
      },
    },
  });
};
