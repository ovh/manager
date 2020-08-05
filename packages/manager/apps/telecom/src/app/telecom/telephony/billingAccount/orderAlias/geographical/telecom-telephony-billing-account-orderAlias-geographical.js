angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.orderAlias.geographical',
      {
        url: '/geographical',
        views: {
          'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
            templateUrl:
              'app/telecom/telephony/billingAccount/orderAlias/geographical/telecom-telephony-billing-account-orderAlias-geographical.html',
            controller: 'TelecomTelephonyAliasOrderGeographicalCtrl',
            controllerAs: 'AliasOrderGeographicalCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_order_geographical_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
