import template from './outgoing-fax.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.consumption.outgoingFax',
    {
      url: '/outgoingFax',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
        },
        'consumptionView@telecom.telephony.billingAccount.fax.consumption.outgoingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingFax/outgoing-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: [
          '.',
          '../../../service/consumption',
          '../../../service/consumption/outgoingFax',
        ],
        format: 'json',
      },
    },
  );
};
