import template from './deposit-movement.html';
import controller from './deposit-movement.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.depositMovement',
    {
      url: '/depositMovement',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          template,
          controller,
          controllerAs: 'BillingAccountDepositMovementCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_group_billing_deposit_movement_breadcrumb',
          ),
      },
    },
  );
};
