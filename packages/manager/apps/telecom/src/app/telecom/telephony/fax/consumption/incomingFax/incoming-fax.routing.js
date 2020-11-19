import template from './incoming-fax.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption.incomingFax',
    {
      url: '/incomingFax',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          template,
        },
        'consumptionView@telecom.telephony.billingAccount.fax.dashboard.consumption.incomingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingFax/incoming-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_group_fax_consumption_incoming_fax_breadcrumb',
          ),
      },
      translations: {
        value: [
          '.',
          '../../../service/consumption',
          '../../../service/consumption/incomingFax',
        ],
        format: 'json',
      },
    },
  );
};
