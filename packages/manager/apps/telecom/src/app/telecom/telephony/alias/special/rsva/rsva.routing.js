import template from './rsva.html';
import controller from './rsva.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.details.rsva', {
    url: '/rsva',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
