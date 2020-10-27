import template from './lines-group.html';
import controller from './lines-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.linesGroup', {
    url: '/linesGroup',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'LinesGroupCtrl',
      },
    },
  });
};
