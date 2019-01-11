angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.fax.convertToVoicefax', {
    url: '/convertToVoicefax',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/fax/convertToVoicefax/telecom-telephony-fax-fax-convertToVoicefax.html',
        noTranslations: true,
        controller: 'TelecomTelephonyFaxFaxConvertToVoiceFaxCtrl',
        controllerAs: '$ctrl',
      },
      'faxConvertToVoicefaxView@telecom.telephony.fax.fax.convertToVoicefax': {
        templateUrl: 'app/telecom/telephony/service/fax/convertToVoicefax/telecom-telephony-service-fax-convertToVoicefax.html',
        controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['../../../service/fax/convertToVoicefax'],
  });
});
