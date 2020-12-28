import template from './cancel.html';
import controller from './cancel.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.terminate.cancel',
    {
      url: '/cancel',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'TerminateCancelCtrl',
        },
      },
    },
  );
};
