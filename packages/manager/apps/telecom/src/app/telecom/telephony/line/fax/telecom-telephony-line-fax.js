angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.fax',
      {
        url: '/fax',
        views: {
          'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/fax/telecom-telephony-line-fax.html',
            controller: 'TelecomTelephonyLineFaxCtrl',
            controllerAs: 'LineFaxCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_fax_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
