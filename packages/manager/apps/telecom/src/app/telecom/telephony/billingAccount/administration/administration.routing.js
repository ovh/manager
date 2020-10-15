import template from './administration.html';
import controller from './administration.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.administration', {
    url: '/administration',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'BillingAccountAdministrationCtrl',
      },
    },
  });
};
