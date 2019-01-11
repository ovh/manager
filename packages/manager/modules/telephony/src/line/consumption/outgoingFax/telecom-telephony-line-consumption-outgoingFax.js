angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.consumption.outgoingFax', {
    url: '/outgoingFax',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/consumption/outgoingFax/telecom-telephony-line-consumption-outgoingFax.html',
        controller: 'TelecomTelephonyLineConsumptionOutgoingFaxCtrl',
        controllerAs: '$ctrl',
      },
      'consumptionView@telecom.telephony.line.consumption.outgoingFax': {
        templateUrl: 'app/telecom/telephony/service/consumption/outgoingFax/telecom-telephony-service-consumption-outgoingFax.html',
        controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
