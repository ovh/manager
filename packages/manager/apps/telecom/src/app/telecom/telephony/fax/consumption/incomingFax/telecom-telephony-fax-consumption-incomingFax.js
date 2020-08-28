angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption.incomingFax',
    {
      url: '/incomingFax',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/consumption/incomingFax/telecom-telephony-fax-consumption-incomingFax.html',
        },
        'consumptionView@telecom.telephony.billingAccount.fax.dashboard.consumption.incomingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingFax/telecom-telephony-service-consumption-incomingFax.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: [
          '.',
          '../../../service/consumption',
          '../../../service/consumption/incomingFax',
        ],
        format: 'json',
      },
    },
  );
});
