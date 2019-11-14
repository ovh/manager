angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.consumptionOutgoingCalls', {
    url: '/outgoingCalls',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/service/consumption/outgoingCalls/telecom-telephony-service-consumption-outgoingCalls.html',
        controller: 'TelecomTelephonyServiceConsumptionOutgoingCallsCtrl',
        controllerAs: 'OutgoingCallsCtrl',
      },
    },
    translations: { value: ['..', '../../../service/consumption/', '../../../service/consumption/outgoingCalls'], format: 'json' },
  });
});
