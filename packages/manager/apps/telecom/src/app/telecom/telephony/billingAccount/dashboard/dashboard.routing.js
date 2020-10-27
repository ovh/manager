import template from './dashboard.html';
import controller from './dashboard.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.dashboard', {
    url: '/dashboard',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'DashboardCtrl',
      },
    },
  });
};
