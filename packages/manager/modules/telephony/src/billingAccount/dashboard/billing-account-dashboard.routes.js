import controller from './billing-account-dashboard.controller';
import template from './billing-account-dashboard.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.dashboard', {
    url: '/dashboard',
    controller,
    controllerAs: 'DashboardCtrl',
    template,
    translations: ['.'],
  });
};
