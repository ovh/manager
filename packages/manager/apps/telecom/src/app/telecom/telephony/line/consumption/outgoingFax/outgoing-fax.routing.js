import template from './outgoing-fax.html';
import controller from './outgoing-fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption.outgoingFax',
    {
      url: '/outgoingFax',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.outgoingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingFax/outgoing-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_management_actions_line_consumption_outgoing_fax_breadcrumb',
          ),
      },
    },
  );
};
