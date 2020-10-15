import template from './called-fees.html';
import controller from './called-fees.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.calledFees', {
    url: '/calledFees',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        controller,
        controllerAs: 'CalledFeesCtrl',
      },
    },
  });
};
