angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.billing', {
      url: '/billing',
      views: {
        'groupInnerView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/telecom-telephony-billing-account-billing.html',
          controller: 'TelecomTelephonyBillingAccountBillingCtrl',
          controllerAs: 'GroupBillingCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_billing_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
