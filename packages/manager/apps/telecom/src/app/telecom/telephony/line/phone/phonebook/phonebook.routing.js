import template from './phonebook.html';
import controller from './phonebook.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.phone.phonebook',
    {
      url: '/phonebook',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'PhonebookCtrl',
        },
      },
    },
  );
};
