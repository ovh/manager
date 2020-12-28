import template from './add-group.html';
import controller from './add-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.addGroup', {
    url: '/addGroup',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'AddGroupCtrl',
      },
    },
  });
};
