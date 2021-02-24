export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.convertToVoicefax', {
    url: '/convertToVoicefax',
    views: {
      'telephonyView@telecom.telephony': {
        component: 'billingAccountConvertToVoiceFax',
      },
      'faxConvertToVoicefaxView@telecom.telephony.billingAccount.convertToVoicefax': {
        templateUrl:
          'app/telecom/telephony/service/fax/convertToVoicefax/convert-to-voicefax.html',
        controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_billing_account_convert_to_voice_fax'),
    },
  });
};
