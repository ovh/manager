angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.billing.bill', {
      url: '/bill',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/bill/telecom-telephony-billing-account-billing-bill.html',
          controller: 'TelecomTelephonyBillingAccountBillingBillCtrl',
          controllerAs: 'BillingAccountBillCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_billing_bill_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
