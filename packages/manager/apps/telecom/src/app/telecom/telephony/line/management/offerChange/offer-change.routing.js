import template from './offer-change.html';
import controller from './offer-change.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.offerChange', {
    url: '/offerChange',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'OfferChangeCtrl',
      },
    },
  });
};
