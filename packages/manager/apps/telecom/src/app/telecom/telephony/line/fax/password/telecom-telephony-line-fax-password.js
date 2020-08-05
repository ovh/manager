angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.fax.password',
      {
        url: '/password',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/fax/password/telecom-telephony-line-fax-password.html',
            noTranslations: true,
          },
          'faxPasswordView@telecom.telephony.billingAccount.line.dashboard.fax.password': {
            templateUrl:
              'app/telecom/telephony/service/fax/password/telecom-telephony-service-fax-password.html',
            controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
            controllerAs: 'PasswordCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_fax_password_breadcrumb'),
        },
        translations: {
          value: ['../../../service/fax/password'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
