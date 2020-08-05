angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.sounds',
      {
        url: '/sounds',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/configuration/ovhPabx/sounds/telecom-telephony-alias-configuration-ovhPabx-sounds.html',
            controller: 'TelecomTelephonyAliasConfigurationOvhPabxSoundsCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_alias_ovh_pabx_sounds_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
