angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.consumptionIncomingCalls', {
    url: '/incomingCalls',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/service/consumption/incomingCalls/telecom-telephony-service-consumption-incomingCalls.html',
        controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
        controllerAs: 'IncomingCallsCtrl',
      },
    },
    translations: { value: ['..', '../../../service/consumption/', '../../../service/consumption/incomingCalls'], format: 'json' },
  });
});
