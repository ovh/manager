angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.billing.summary', {
      url: '/summary',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/billingAccount/billing/summary/telecom-telephony-billing-account-billing-summary.html',
          controller: 'TelecomTelephonyBillingAccountBillingSummaryCtrl',
          controllerAs: 'SummaryCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_billing_summary_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
