import template from './repayments.html';
import controller from './repayments.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.repayments', {
    url: '/repayments',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
