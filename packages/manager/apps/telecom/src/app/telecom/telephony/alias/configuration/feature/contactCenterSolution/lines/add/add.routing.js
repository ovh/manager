import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.lines.add',
    {
      url: '/add',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['..'], format: 'json' },
    },
  );
};
