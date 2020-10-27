import template from './fax.html';
import controller from './fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax', {
    url: '/fax',
    views: {
      'faxInnerView@telecom.telephony.billingAccount.fax': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
