angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone', {
    url: '/phone',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/telecom-telephony-line-phone.html',
        controller: 'TelecomTelephonyLinePhoneCtrl',
        controllerAs: 'LinePhoneCtrl',
      },
    },
    translations: ['.'],
  });
});
