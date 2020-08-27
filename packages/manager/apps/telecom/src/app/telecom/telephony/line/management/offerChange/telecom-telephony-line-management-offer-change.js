angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.offerChange',
    {
      url: '/offerChange',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/offerChange/telecom-telephony-line-management-offer-change.html',
          controller: 'TelecomTelephonyLineManagementOfferChangeCtrl',
          controllerAs: 'OfferChangeCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
