angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.phonebooks.create', {
    url: '/create',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/phonebooks/create/telecom-sms-phonebooks-create.html',
        controller: 'TelecomSmsPhonebooksCreateCtrl',
        controllerAs: 'PhonebooksCreateCtrl',
      },
    },
    translations: ['.'],
  });
});
