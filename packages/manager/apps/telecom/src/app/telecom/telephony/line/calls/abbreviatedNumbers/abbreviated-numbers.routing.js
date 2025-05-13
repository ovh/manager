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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_actions_line_calls_abbreviated_numbers_title',
          ),
      },
    },
  );
};
