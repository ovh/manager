angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.terminate',
      {
        url: '/terminate',
        views: {
          'aliasView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/alias/administration/terminate/telecom-telephony-alias-administration-terminate.html',
            controller: 'TelecomTelephonyAliasAdministrationTerminateCtrl',
            controllerAs: 'AliasTerminateCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_administration_terminate_title',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
