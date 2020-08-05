angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.assist.rma',
      {
        url: '/rma',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/assist/rma/telecom-telephony-line-assist-rma.html',
            controller: 'TelecomTelephonyLineAssistRmaCtrl',
            controllerAs: 'RmaCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_assist_rma_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
