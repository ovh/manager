import template from './terminate.html';
import controller from './terminate.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.management.terminate',
    {
      url: '/terminate',
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
