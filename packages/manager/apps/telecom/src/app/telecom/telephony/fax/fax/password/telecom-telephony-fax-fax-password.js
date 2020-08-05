angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.fax.password',
      {
        url: '/password',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/fax/fax/password/telecom-telephony-fax-fax-password.html',
            noTranslations: true,
          },
          'faxPasswordView@telecom.telephony.billingAccount.fax.dashboard.fax.password': {
            templateUrl:
              'app/telecom/telephony/service/fax/password/telecom-telephony-service-fax-password.html',
            controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
            controllerAs: 'PasswordCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_fax_fax_password'),
        },
        translations: {
          value: ['../../../service/fax/password'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
