angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.fax.password', {
    url: '/password',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/fax/password/telecom-telephony-fax-fax-password.html',
        noTranslations: true,
      },
      'faxPasswordView@telecom.telephony.fax.fax.password': {
        templateUrl: 'app/telecom/telephony/service/fax/password/telecom-telephony-service-fax-password.html',
        controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
        controllerAs: 'PasswordCtrl',
      },
    },
    translations: ['../../../service/fax/password'],
  });
});
