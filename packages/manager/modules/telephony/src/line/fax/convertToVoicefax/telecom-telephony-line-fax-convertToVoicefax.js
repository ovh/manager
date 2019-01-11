angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.fax.convertToVoicefax', {
    url: '/convertToVoicefax',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/fax/convertToVoicefax/telecom-telephony-line-fax-convertToVoicefax.html',
        noTranslations: true,
      },
      'faxConvertToVoicefaxView@telecom.telephony.line.fax.convertToVoicefax': {
        templateUrl: 'app/telecom/telephony/service/fax/convertToVoicefax/telecom-telephony-service-fax-convertToVoicefax.html',
        controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['../../../service/fax/convertToVoicefax'],
  });
});
