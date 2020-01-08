angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.phone.phonebook',
    {
      url: '/phonebook',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/phone/phonebook/telecom-telephony-line-phone-phonebook.html',
          controller: 'TelecomTelephonyLinePhonePhonebookCtrl',
          controllerAs: 'PhonebookCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
