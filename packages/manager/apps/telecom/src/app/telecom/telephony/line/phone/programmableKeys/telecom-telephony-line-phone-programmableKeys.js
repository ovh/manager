angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.phone.programmableKeys',
      {
        url: '/programmableKeys',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/phone/programmableKeys/telecom-telephony-line-phone-programmableKeys.html',
            controller: 'TelecomTelephonyLinePhoneProgammableKeysCtrl',
            controllerAs: 'ProgrammableKeysCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_phone_programmableKeys_keys_title',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
