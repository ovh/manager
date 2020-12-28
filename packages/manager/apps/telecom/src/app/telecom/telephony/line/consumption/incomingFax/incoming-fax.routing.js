import template from './incoming-fax.html';
import controller from './incoming-fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.consumption.incomingFax',
    {
      url: '/incomingFax',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.consumption.incomingFax': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingFax/incoming-fax.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
