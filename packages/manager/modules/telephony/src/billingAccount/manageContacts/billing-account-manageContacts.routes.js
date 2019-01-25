import controller from './billing-account-manageContacts.controller';
import template from './billing-account-manageContacts.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.manageContacts', {
    url: '/manageContacts',
    template,
    controller,
    controllerAs: 'ManageContactsCtrl',
    translations: ['.'],
  });
};
