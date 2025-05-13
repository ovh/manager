import template from './deposit.html';
import controller from './deposit.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.deposit', {
    url: '/deposit',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        controller,
        controllerAs: 'BillingDepositCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_billing_actions_billing_deposit_title'),
    },
  });
};
