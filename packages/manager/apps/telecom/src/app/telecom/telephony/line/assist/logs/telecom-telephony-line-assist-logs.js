angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.assist.logs',
      {
        url: '/logs',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/service/assist/logs/telecom-telephony-service-assist-logs.html',
            controller: 'TelecomTelephonyServiceAssistLogsCtrl',
            controllerAs: 'LogsCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_assist_logs_breadcrumb'),
        },
        translations: {
          value: ['../../../service/assist/logs'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
