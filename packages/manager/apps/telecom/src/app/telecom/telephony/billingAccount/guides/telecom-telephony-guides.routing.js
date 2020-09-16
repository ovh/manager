import controller from './telecom-telephony-guides.controller';
import template from './telecom-telephony-guides.html';

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
    translations: { value: ['.', '../guides'], format: 'json' },
  });
};
