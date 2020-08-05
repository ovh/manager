angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.answer',
      {
        url: '/answer',
        views: {
          'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/answer/telecom-telephony-line-answer.html',
            controller: 'TelecomTelephonyLineAnswerCtrl',
            controllerAs: 'LineAnswerCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_answer_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
