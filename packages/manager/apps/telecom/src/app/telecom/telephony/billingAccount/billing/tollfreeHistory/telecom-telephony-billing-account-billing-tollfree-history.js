angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.billing.tollfree-history',
      {
        url: '/tollfree-history',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/billingAccount/billing/tollfreeHistory/telecom-telephony-billing-account-billing-tollfree-history.html',
            controller:
              'TelecomTelephonyBillingAccountBillingTollfreeHistoryCtrl',
            controllerAs: 'TollfreeHistoryCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_billing_tollfree_history_title',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
