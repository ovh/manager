import template from './bill.html';
import controller from './bill.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing.bill', {
    url: '/bill',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        controller,
        controllerAs: 'BillingAccountBillCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_billing_bill_title'),
    },
  });
};
