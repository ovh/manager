import template from './dashboard.html';
import controller from './dashboard.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.dashboard', {
    url: '',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
