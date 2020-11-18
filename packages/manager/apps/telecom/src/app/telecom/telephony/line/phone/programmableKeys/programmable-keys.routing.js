import template from './programmable-keys.html';
import controller from './programmable-keys.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.programmableKeys',
    {
      url: '/programmableKeys',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'ProgrammableKeysCtrl',
        },
      },
    },
  );
};
