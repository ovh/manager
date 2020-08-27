import template from './phonebook.html';
import controller from './phonebook.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.phonebook',
    {
      url: '/phonebook',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'PhonebookCtrl',
        },
      },
    },
  );
};
