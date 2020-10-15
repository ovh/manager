import template from './abbreviated-numbers.html';
import controller from './abbreviated-numbers.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'AbbreviatedNumbersCtrl',
      },
    },
  });
};
