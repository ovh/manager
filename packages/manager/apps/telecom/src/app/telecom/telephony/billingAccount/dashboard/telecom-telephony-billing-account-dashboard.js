angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.dashboard', {
    url: '/dashboard',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/dashboard/telecom-telephony-billing-account-dashboard.html',
        controller: 'TelecomTelephonyBillingAccountDashboardCtrl',
        controllerAs: 'DashboardCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
