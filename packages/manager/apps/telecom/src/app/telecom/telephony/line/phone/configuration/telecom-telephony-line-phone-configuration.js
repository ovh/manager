angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.phone.configuration',
      {
        url: '/configuration',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/phone/configuration/telecom-telephony-line-phone-configuration.html',
            controller: 'TelecomTelephonyLinePhoneConfigurationCtrl',
            controllerAs: 'PhoneConfigCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_phone_configuration_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
