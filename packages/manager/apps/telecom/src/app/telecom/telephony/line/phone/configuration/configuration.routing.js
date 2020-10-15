import template from './configuration.html';
import controller from './configuration.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.phone.configuration',
    {
      url: '/configuration',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'PhoneConfigCtrl',
        },
      },
    },
  );
};
