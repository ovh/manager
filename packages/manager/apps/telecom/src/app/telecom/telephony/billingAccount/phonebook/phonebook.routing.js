import template from './phonebook.html';
import controller from './phonebook.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.phonebook', {
    url: '/phonebook',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'PhonebookCtrl',
      },
    },
  });
};
