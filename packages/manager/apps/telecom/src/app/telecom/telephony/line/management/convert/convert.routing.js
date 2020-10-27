import template from './convert.html';
import controller from './convert.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.convert', {
    url: '/convert',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineConvertCtrl',
      },
    },
  });
};
