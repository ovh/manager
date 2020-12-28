import template from './menus.html';
import controller from './menus.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.ovhPabx.menus',
    {
      url: '/menus',
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
