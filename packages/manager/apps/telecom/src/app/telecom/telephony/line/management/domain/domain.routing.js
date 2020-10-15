import template from './domain.html';
import controller from './domain.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.domain', {
    url: '/domain',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'DomainCtrl',
      },
    },
  });
};
