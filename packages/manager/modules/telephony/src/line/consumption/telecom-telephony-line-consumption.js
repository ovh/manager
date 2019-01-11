angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.consumption', {
    url: '/consumption',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/consumption/telecom-telephony-line-consumption.html',
        controller: 'TelecomTelephonyLineConsumptionCtrl',
        controllerAs: 'LineConsumptionCtrl',
      },
    },
    translations: [
      '../consumption',
      '../../service/consumption',
      '../../service/consumption/incomingCalls',
      '../../service/consumption/outgoingCalls',
      '../../service/consumption/incomingFax',
      '../../service/consumption/outgoingFax',
    ],
  });
});
