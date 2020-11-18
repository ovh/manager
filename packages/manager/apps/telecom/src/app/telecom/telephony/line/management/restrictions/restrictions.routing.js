import template from './restrictions.html';
import controller from './restrictions.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.restrictions',
    {
      url: '/restrictions',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineRestrictionsCtrl',
        },
      },
    },
  );
};
