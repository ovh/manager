import template from './programmable-keys.html';
import controller from './programmable-keys.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.phone.programmableKeys',
    {
      url: '/programmableKeys',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'ProgrammableKeysCtrl',
        },
      },
    },
  );
};
