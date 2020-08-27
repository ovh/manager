angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption',
    {
      url: '/consumption',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/consumption/telecom-telephony-line-consumption.html',
          controller: 'TelecomTelephonyLineConsumptionCtrl',
          controllerAs: 'LineConsumptionCtrl',
        },
      },
      translations: {
        value: [
          '.',
          '../../service/consumption',
          '../../service/consumption/incomingCalls',
          '../../service/consumption/outgoingCalls',
          '../../service/consumption/incomingFax',
          '../../service/consumption/outgoingFax',
        ],
        format: 'json',
      },
    },
  );
});
