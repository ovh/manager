angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.phonebooks', {
    url: '/phonebooks',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/phonebooks/telecom-sms-phonebooks.html',
        controller: 'TelecomSmsPhonebooksCtrl',
        controllerAs: 'PhonebooksCtrl',
      },
    },
    params: {
      bookKey: null,
    },
    translations: ['.'],
  });
});
