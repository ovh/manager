import template from './repayment-history.html';
import controller from './repayment-history.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.repayment-history',
    {
      url: '/repayment-history',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          controller,
          controllerAs: 'RepaymentHistoryCtrl',
        },
      },
    },
  );
};
