angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.billing.deposit', {
      url: '/deposit',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/deposit/telecom-telephony-billing-account-billing-deposit.html',
          controller: 'TelecomTelephonyBillingAccountBillingDepositCtrl',
          controllerAs: 'BillingDepositCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_billing_actions_billing_deposit_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
