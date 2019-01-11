angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.fax.password', {
    url: '/password',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/fax/password/telecom-telephony-line-fax-password.html',
        noTranslations: true,
      },
      'faxPasswordView@telecom.telephony.line.fax.password': {
        templateUrl: 'app/telecom/telephony/service/fax/password/telecom-telephony-service-fax-password.html',
        controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
        controllerAs: 'PasswordCtrl',
      },
    },
    translations: ['../../../service/fax/password'],
  });
});
