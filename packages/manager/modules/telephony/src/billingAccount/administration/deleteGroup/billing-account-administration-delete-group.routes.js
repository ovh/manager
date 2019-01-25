import controller from './billing-account-administration-delete-group.controller';
import template from './billing-account-administration-delete-group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.administration.deleteGroup', {
    url: '/deleteGroup',
    template,
    controller,
    controllerAs: 'DeleteGroupCtrl',
    translations: ['.'],
  });
};
