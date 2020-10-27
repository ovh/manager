import template from './change-type.html';
import controller from './change-type.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.changeType', {
    url: '/changeType',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
