angular
  .module('managerApp')
  .config(($stateProvider) =>
    $stateProvider.state(
      'telecom.telephony.billingAccount.billing.groupRepayments',
      {
        url: '/groupRepayments',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/billingAccount/billing/groupRepayments/telecom-telephony-billing-account-billing-group-repayments.html',
            controller:
              'TelecomTelephonyBillingAccountBillingGroupRepaymentsCtrl',
            controllerAs: 'GroupRepaymentsCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_billing_group_repayments_title',
            ),
        },
      },
    ),
  )
  .run(/* @ngTranslationsInject:json ./translations */);
