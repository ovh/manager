import template from './manage-contacts.html';
import controller from './manage-contacts.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.manageContacts', {
    url: '/manageContacts',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'ManageContactsCtrl',
      },
    },
  });
};
