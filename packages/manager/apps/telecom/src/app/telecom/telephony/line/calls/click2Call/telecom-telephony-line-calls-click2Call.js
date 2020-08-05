angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.calls.click2call',
      {
        url: '/click2call',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/calls/click2Call/telecom-telephony-line-calls-click2Call.html',
            controller: 'TelecomTelephonyLineClick2CallCtrl',
            controllerAs: 'Click2CallCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_group_line_calls_click2call_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
