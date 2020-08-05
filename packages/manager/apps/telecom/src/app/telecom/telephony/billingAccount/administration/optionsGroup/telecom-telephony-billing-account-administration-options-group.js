angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.administration.optionsGroup',
      {
        url: '/optionsGroup',
        views: {
          'groupInnerView@telecom.telephony.billingAccount': {
            templateUrl:
              'app/telecom/telephony/billingAccount/administration/optionsGroup/telecom-telephony-billing-account-administration-options-group.html',
            controller:
              'TelecomTelephonyBillingAccountAdministrationOptionsGroup',
            controllerAs: 'OptionsGroupCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_options_group_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
