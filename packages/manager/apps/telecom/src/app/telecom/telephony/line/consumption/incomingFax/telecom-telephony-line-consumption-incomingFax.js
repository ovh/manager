angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.consumption.incomingFax',
    {
      url: '/incomingFax',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/consumption/incomingFax/telecom-telephony-line-consumption-incomingFax.html',
          controller: 'TelecomTelephonyLineConsumptionIncomingFaxCtrl',
          controllerAs: '$ctrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.consumption.incomingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingFax/telecom-telephony-service-consumption-incomingFax.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
