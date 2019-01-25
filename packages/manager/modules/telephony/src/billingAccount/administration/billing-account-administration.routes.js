import controller from './billing-account-administration.controller';
import template from './billing-account-administration.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.administration', {
    url: '/administration',
    template,
    controller,
    controllerAs: 'BillingAccountAdministrationCtrl',
    translations: ['.', '../billing'],
  });
};
