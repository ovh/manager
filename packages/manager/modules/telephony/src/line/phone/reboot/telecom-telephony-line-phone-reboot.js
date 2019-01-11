angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone.reboot', {
    url: '/reboot',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/reboot/telecom-telephony-line-phone-reboot.html',
        controller: 'TelecomTelephonyLinePhoneRebootCtrl',
        controllerAs: 'PhoneRebootCtrl',
      },
    },
    translations: ['.'],
  });
});
