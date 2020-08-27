angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.details',
    {
      url: '/details',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/phone/details/telecom-telephony-line-phone-details.html',
        },
        'detailsView@telecom.telephony.billingAccount.line.dashboard.phone.details': {
          templateUrl:
            'app/telecom/telephony/line/details/telecom-telephony-line-details.html',
          controller: 'TelecomTelephonyLineDetailsCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
