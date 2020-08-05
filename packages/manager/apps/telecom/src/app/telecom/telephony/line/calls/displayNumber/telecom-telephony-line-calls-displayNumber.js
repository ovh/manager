angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.calls.line_displayNumber',
      {
        url: '/displayNumber',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/calls/displayNumber/telecom-telephony-line-calls-displayNumber.html',
            controller: 'TelecomTelephonyLineCallsDisplayNumberCtrl',
            controllerAs: 'LineDisplayNumberCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_actions_line_calls_display_number_title',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
