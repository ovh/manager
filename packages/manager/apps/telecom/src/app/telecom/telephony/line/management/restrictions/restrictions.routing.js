import template from './restrictions.html';
import controller from './restrictions.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.restrictions', {
    url: '/restrictions',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineRestrictionsCtrl',
      },
    },
  });
};
