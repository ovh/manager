import template from './billing.html';
import controller from './billing.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing', {
    url: '/billing',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'GroupBillingCtrl',
      },
    },
  });
};
