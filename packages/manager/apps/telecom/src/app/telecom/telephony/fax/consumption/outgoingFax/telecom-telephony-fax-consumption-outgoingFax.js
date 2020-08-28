angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax',
    {
      url: '/outgoingFax',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/consumption/outgoingFax/telecom-telephony-fax-consumption-outgoingFax.html',
        },
        'consumptionView@telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingFax/telecom-telephony-service-consumption-outgoingFax.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: [
          '.',
          '../../../service/consumption',
          '../../../service/consumption/outgoingFax',
        ],
        format: 'json',
      },
    },
  );
});
