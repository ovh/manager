angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.billing.creditThreshold',
      {
        url: '/creditThreshold',
        views: {
          'groupView@telecom.telephony.billingAccount': {
            templateUrl:
              'app/telecom/telephony/billingAccount/billing/creditThreshold/telecom-telephony-billing-account-billing-credit-threshold.html',
            controller:
              'TelecomTelephonyBillingAccountBillingCreditThresholdCtrl',
            controllerAs: 'BillingAccountCreditThresholdCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_billing_credit_threshold_title',
            ),
        },
        translations: { value: ['..'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
