angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.tones',
      {
        url: '/tones',
        views: {
          'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/tones/telecom-telephony-line-tones.html',
            controller: 'TelecomTelephonyLineTonesCtrl',
            controllerAs: 'LineTonesCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_tones_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
