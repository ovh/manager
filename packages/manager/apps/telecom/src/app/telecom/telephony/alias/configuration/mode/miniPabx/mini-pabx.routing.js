import template from './mini-pabx.html';
import controller from './mini-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.mode.miniPabx',
    {
      url: '/miniPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
