import controller from './billing-account-phonebook.controller';
import template from './billing-account-phonebook.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.phonebook', {
    url: '/phonebook',
    template,
    controller,
    controllerAs: 'PhonebookCtrl',
    translations: ['.'],
  });
};
