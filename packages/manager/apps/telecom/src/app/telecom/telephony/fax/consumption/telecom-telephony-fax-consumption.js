angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption',
    {
      url: '/consumption',
      views: {
        faxInnerView: {
          templateUrl:
            'app/telecom/telephony/fax/consumption/telecom-telephony-fax-consumption.html',
          controller: 'TelecomTelephonyFaxConsumptionCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
