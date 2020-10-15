import template from './reboot.html';
import controller from './reboot.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.reboot', {
    url: '/reboot',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'PhoneRebootCtrl',
      },
    },
  });
};
