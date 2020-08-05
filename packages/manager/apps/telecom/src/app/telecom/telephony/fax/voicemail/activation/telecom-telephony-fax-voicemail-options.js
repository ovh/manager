angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.voicemail.activation',
      {
        url: '/activation',
        views: {
          'faxView@telecom.telephony.billingAccount.fax.dashboard': {
            templateUrl:
              'app/telecom/telephony/fax/voicemail/activation/telecom-telephony-fax-voicemail-activation.html',
            controller: 'TelecomTelephonyFaxVoicemailActivationCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_fax_voicemail_activation_activate',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
