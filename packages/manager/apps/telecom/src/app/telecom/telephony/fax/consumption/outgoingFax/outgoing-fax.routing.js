import template from './outgoing-fax.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax',
    {
      url: '/outgoingFax',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          template,
        },
        'consumptionView@telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingFax/outgoing-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_group_fax_consumption_outgoing_fax_breadcrumb',
          ),
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
