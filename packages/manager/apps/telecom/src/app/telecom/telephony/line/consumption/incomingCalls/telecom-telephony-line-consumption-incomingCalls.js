angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption.incomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/consumption/incomingCalls/telecom-telephony-line-consumption-incomingCalls.html',
          controller: 'TelecomTelephonyLineConsumptionIncomingCallsCtrl',
          controllerAs: 'LineIncomingCallsCtrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.incomingCalls': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/telecom-telephony-service-consumption-incomingCalls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
