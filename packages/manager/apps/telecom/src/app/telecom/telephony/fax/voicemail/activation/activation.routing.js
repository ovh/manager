import template from './activation.html';
import controller from './activation.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.voicemail.activation',
    {
      url: '/activation',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
