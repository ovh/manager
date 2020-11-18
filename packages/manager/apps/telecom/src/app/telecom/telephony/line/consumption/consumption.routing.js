import template from './consumption.html';
import controller from './consumption.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption',
    {
      url: '/consumption',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineConsumptionCtrl',
        },
      },
      translations: {
        value: [
          '.',
          '../../service/consumption',
          '../../service/consumption/outgoingCalls',
          '../../service/consumption/outgoingFax',
        ],
        format: 'json',
      },
    },
  );
};
