angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.calls.callWaiting',
      {
        url: '/callWaiting',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/calls/callWaiting/telecom-telephony-line-calls-callWaiting.html',
            controller: 'TelecomTelephonyLineCallsCallWaitingCtrl',
            controllerAs: 'LineCallWaitingCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_actions_line_calls_call_waiting_title',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
