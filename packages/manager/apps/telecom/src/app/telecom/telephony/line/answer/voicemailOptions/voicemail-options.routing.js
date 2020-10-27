import template from './voicemail-options.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.voicemailOptions',
    {
      url: '/voicemailOptions',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.line.voicemailOptions': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/options/options.html',
          controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
          controllerAs: 'VoicemailOptionsCtrl',
        },
      },
    },
  );
};
