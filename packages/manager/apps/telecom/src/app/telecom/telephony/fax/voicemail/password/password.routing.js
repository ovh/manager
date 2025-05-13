import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail.password',
    {
      url: '/password',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.dashboard.voicemail.password': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/password/password.html',
          controller: 'TelecomTelephonyServiceVoicemailPasswordCtrl',
          controllerAs: 'VoicemailPasswordCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_voicemail_password'),
      },
    },
  );
};
