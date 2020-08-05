angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.orderAlias.nongeographical',
      {
        url: '/nonGeographical',
        views: {
          'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
            templateUrl:
              'app/telecom/telephony/billingAccount/orderAlias/nonGeographical/telecom-telephony-billing-account-orderAlias-nonGeographical.html',
            controller: 'TelecomTelephonyAliasOrderNonGeographicalCtrl',
            controllerAs: 'AliasOrderNonGeographicalCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_order_nongeographical_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
