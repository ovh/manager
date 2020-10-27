import controller from './sounds.controller';
import template from './sounds.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.sounds',
    {
      url: '/sounds',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
