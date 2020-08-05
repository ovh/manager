angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.orderAlias.special',
      {
        url: '/special',
        views: {
          'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
            templateUrl:
              'app/telecom/telephony/billingAccount/orderAlias/special/telecom-telephony-billing-account-orderAlias-special.html',
            controller: 'TelecomTelephonyAliasOrderSpecialCtrl',
            controllerAs: 'AliasOrderSpecialCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_order_special_title'),
        },
        translations: {
          value: ['../../../alias/special/rsva'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
