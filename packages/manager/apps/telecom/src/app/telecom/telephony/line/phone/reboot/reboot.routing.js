import template from './reboot.html';
import controller from './reboot.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.reboot',
    {
      url: '/reboot',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'PhoneRebootCtrl',
        },
      },
    },
  );
};
