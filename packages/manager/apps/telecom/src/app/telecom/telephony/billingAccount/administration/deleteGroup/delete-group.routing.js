import template from './delete-group.html';
import controller from './delete-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.deleteGroup', {
    url: '/deleteGroup',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'DeleteGroupCtrl',
      },
    },
  });
};
