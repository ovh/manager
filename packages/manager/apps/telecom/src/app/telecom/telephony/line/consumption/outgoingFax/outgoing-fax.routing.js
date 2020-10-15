import template from './outgoing-fax.html';
import controller from './outgoing-fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.consumption.outgoingFax',
    {
      url: '/outgoingFax',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.consumption.outgoingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingFax/outgoing-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
