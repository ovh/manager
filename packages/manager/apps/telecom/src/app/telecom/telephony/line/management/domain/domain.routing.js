import template from './domain.html';
import controller from './domain.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.domain',
    {
      url: '/domain',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'DomainCtrl',
        },
      },
    },
  );
};
