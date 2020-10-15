import template from './consumption.html';
import controller from './consumption.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.consumption', {
    url: '/consumption',
    views: {
      faxInnerView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
