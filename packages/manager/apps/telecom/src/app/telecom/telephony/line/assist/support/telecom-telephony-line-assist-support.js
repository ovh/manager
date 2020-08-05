angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.assist.support',
      {
        url: '/support',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/service/assist/support/telecom-telephony-service-assist-support.html',
            controller: 'TelecomTelephonyServiceAssistSupportCtrl',
            controllerAs: 'SupportCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_assist_support_breadcrumb'),
        },
        translations: {
          value: ['../../../service/assist/support'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
