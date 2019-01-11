angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.consumption.incomingCalls', {
    url: '/incomingCalls',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/consumption/incomingCalls/telecom-telephony-line-consumption-incomingCalls.html',
        controller: 'TelecomTelephonyLineConsumptionIncomingCallsCtrl',
        controllerAs: 'LineIncomingCallsCtrl',
      },
      'consumptionView@telecom.telephony.line.consumption.incomingCalls': {
        templateUrl: 'app/telecom/telephony/service/consumption/incomingCalls/telecom-telephony-service-consumption-incomingCalls.html',
        controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
        controllerAs: 'IncomingCallsCtrl',
      },
    },
    translations: ['.'],
  });
});
