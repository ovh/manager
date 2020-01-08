angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.fax.convertToVoicefax',
    {
      url: '/convertToVoicefax',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/fax/convertToVoicefax/telecom-telephony-line-fax-convertToVoicefax.html',
          noTranslations: true,
        },
        'faxConvertToVoicefaxView@telecom.telephony.billingAccount.line.fax.convertToVoicefax': {
          templateUrl:
            'app/telecom/telephony/service/fax/convertToVoicefax/telecom-telephony-service-fax-convertToVoicefax.html',
          controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../../../service/fax/convertToVoicefax'],
        format: 'json',
      },
    },
  );
});
