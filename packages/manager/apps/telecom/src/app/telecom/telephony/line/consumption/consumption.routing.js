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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_management_actions_line_consumption_breadcrumb',
          ),
      },
      translations: {
        value: [
          '../../service/consumption',
          '../../service/consumption/outgoingCalls',
          '../../service/consumption/outgoingFax',
        ],
        format: 'json',
      },
    },
  );
};
