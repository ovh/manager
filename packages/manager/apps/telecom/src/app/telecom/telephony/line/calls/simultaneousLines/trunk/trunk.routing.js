import template from './trunk.html';
import controller from './trunk.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.simultaneousLinesTrunk',
    {
      url: '/simultaneousLinesTrunk',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
