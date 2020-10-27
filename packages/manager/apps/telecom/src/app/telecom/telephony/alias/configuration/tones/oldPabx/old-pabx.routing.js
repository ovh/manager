import template from './old-pabx.html';
import controller from './old-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.tones.oldPabx',
    {
      url: '/oldPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
};
