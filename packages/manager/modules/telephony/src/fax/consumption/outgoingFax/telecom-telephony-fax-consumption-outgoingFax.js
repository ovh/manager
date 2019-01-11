angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.consumption.outgoingFax', {
    url: '/outgoingFax',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/consumption/outgoingFax/telecom-telephony-fax-consumption-outgoingFax.html',
      },
      'consumptionView@telecom.telephony.fax.consumption.outgoingFax': {
        templateUrl: 'app/telecom/telephony/service/consumption/outgoingFax/telecom-telephony-service-consumption-outgoingFax.html',
        controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: [
      '.',
      '../../consumption',
      '../../consumption/outgoingFax',
    ],
  });
});
