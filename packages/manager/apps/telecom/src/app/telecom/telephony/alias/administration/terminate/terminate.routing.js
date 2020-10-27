import template from './terminate.html';
import controller from './terminate.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.terminate', {
    url: '/terminate',
    views: {
      'aliasView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: 'AliasTerminateCtrl',
      },
    },
  });
};
