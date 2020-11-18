import template from './configuration.html';
import controller from './configuration.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.configuration',
    {
      url: '/configuration',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'PhoneConfigCtrl',
        },
      },
    },
  );
};
