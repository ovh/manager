import template from './abbreviated-numbers.html';
import controller from './abbreviated-numbers.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.abbreviatedNumbers',
    {
      url: '/abbreviatedNumbers',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineAbbreviatedNumbersCtrl',
        },
      },
    },
  );
};
