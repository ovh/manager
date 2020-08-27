import template from './trunk.html';
import controller from './trunk.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.simultaneousLinesTrunk',
    {
      url: '/simultaneousLinesTrunk',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
