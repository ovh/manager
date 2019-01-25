export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.calledFees', {
    url: '/calledFees',
    templateUrl: 'app/telecom/telephony/billingAccount/billing/calledFees/telecom-telephony-billing-account-billing-called-fees.html',
    controller: 'TelecomTelephonyBillingAccountBillingCalledFeesCtrl',
    controllerAs: 'CalledFeesCtrl',
    translations: ['.'],
  });
};
