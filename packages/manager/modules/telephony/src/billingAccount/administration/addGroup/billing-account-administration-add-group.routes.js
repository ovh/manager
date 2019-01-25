import controller from './billing-account-administration-add-group.controller';
import template from './billing-account-administration-add-group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.administration.addGroup', {
    url: '/addGroup',
    template,
    controller,
    controllerAs: 'AddGroupCtrl',
    translations: ['.'],
  });
};
