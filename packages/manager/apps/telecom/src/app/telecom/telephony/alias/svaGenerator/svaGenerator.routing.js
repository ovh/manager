import template from './svaGenerator.html';
import controller from './svaGenerator.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.svaGenerator',
    {
      url: '/svaGenerator',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: 'SvaGeneratorCtrl',
        },
      },
    },
  );
};
