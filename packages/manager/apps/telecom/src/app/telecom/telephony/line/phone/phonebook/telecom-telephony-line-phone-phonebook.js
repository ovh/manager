angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.phone.phonebook',
      {
        url: '/phonebook',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/phone/phonebook/telecom-telephony-line-phone-phonebook.html',
            controller: 'TelecomTelephonyLinePhonePhonebookCtrl',
            controllerAs: 'PhonebookCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_phone_actions_line_details_phone_phonebook_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
