angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.calls.abbreviatedNumbers',
      {
        url: '/abbreviatedNumbers',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/calls/abbreviatedNumbers/telecom-telephony-line-calls-abbreviatedNumbers.html',
            controller: 'TelecomTelephonyLineCallsAbbreviatedNumbersCtrl',
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
  })
  .run(/* @ngTranslationsInject:json ./translations */);
