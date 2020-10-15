import controller from './guides.controller';
import template from './guides.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.guides', {
    url: '/guides',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
