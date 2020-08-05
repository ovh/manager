angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.tts',
      {
        url: '/tts',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/ovhPabx/tts/telecom-telephony-alias-configuration-ovhPabx-tts.html',
            controller: 'TelecomTelephonyAliasConfigurationOvhPabxTtsCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_alias_ovh_pabx_tts_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
