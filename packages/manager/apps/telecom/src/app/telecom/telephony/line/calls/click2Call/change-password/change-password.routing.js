import template from './change-password.html';
import controller from './change-password.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.click2call.changePassword',
    {
      url: '/modify/:userId',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'Click2CallChangePasswordCtrl',
        },
      },
    },
  );
};
