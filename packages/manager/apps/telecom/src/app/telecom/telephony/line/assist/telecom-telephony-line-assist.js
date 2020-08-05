angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.assist',
      {
        url: '/assist',
        views: {
          'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/assist/telecom-telephony-line-assist.html',
            controller: 'TelecomTelephonyLineAssistCtrl',
            controllerAs: 'LineAssistCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_assist_breadcrumb'),
        },
        translations: {
          value: ['./troubleshooting/procedure', '../../service/assist'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
