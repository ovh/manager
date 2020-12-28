import template from './simultaneous-lines.html';
import controller from './simultaneous-lines.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.simultaneousLines',
    {
      url: '/simultaneousLines',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'LineSimultaneousLinesCtrl',
        },
      },
    },
  );
};
