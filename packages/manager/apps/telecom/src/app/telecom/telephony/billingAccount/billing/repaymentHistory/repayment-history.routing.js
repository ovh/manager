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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_billing_repayment_history_title'),
      },
    },
  );
};
