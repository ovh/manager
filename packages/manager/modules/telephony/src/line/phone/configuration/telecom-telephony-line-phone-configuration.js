angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone.configuration', {
    url: '/configuration',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/configuration/telecom-telephony-line-phone-configuration.html',
        controller: 'TelecomTelephonyLinePhoneConfigurationCtrl',
        controllerAs: 'PhoneConfigCtrl',
      },
    },
    translations: ['.'],
  });
});
