import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.voicemail.password',
    {
      url: '/password',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.voicemail.password': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/password/password.html',
          controller: 'TelecomTelephonyServiceVoicemailPasswordCtrl',
          controllerAs: 'VoicemailPasswordCtrl',
        },
      },
    },
  );
};
