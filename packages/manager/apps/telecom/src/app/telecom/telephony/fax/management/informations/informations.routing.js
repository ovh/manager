import template from './informations.html';
import controller from './informations.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.management.informations',
    {
      url: '/informations',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
};
