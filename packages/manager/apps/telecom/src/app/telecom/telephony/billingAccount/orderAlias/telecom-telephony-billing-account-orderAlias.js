angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.orderAlias', {
      url: '/orderAlias',
      views: {
        'groupInnerView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias.html',
        },
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          templateUrl:
            'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias-main.view.html',
          controller: 'TelecomTelephonyBillingAccountOrderAliasCtrl',
          controllerAs: 'AliasOrderCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_order_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
