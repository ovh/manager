angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.billing.calledFees',
      {
        url: '/calledFees',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/billingAccount/billing/calledFees/telecom-telephony-billing-account-billing-called-fees.html',
            controller: 'TelecomTelephonyBillingAccountBillingCalledFeesCtrl',
            controllerAs: 'CalledFeesCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_group_billing_called_fees_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
