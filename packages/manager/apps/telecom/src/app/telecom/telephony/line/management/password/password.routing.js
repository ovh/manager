import template from './password.html';
import controller from './password.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.password', {
    url: '/password',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'PasswordCtrl',
      },
    },
  });
};
