angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.consumption.incomingFax', {
    url: '/incomingFax',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/consumption/incomingFax/telecom-telephony-line-consumption-incomingFax.html',
        controller: 'TelecomTelephonyLineConsumptionIncomingFaxCtrl',
        controllerAs: '$ctrl',
      },
      'consumptionView@telecom.telephony.line.consumption.incomingFax': {
        templateUrl: 'app/telecom/telephony/service/consumption/incomingFax/telecom-telephony-service-consumption-incomingFax.html',
        controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
