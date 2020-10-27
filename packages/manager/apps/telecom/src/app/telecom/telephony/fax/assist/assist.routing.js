import template from './assist.html';
import controller from './assist.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.assist', {
    url: '/assist',
    views: {
      faxInnerView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
