angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.calls.timeCondition',
      {
        url: '/timeCondition',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/calls/timeCondition/telecom-telephony-line-calls-time-condition.html',
            controller: 'TelecomTelephonyLineCallsTimeConditionCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_calls_time_condition_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
