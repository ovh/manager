import template from './svaGenerator.html';
import controller from './svaGenerator.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.svaGenerator', {
    url: '/svaGenerator',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: 'SvaGeneratorCtrl',
      },
    },
  });
};
