angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.voicemail',
      {
        url: '/voicemail',
        views: {
          faxInnerView: {
            templateUrl:
              'app/telecom/telephony/fax/voicemail/telecom-telephony-fax-voicemail.html',
            controller: 'TelecomTelephonyFaxVoicemailCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_group_fax_voicemail_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
