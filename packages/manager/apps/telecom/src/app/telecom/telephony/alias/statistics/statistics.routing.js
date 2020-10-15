import template from './statistics.html';
import controller from './statistics.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.statistics', {
    url: '/statistics',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
