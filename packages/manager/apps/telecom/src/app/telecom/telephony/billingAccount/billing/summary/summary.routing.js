import template from './summary.html';
import controller from './summary.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.summary', {
    url: '/summary',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        controller,
        controllerAs: 'SummaryCtrl',
      },
    },
  });
};
