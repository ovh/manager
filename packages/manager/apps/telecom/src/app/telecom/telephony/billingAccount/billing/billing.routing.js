import template from './billing.html';
import controller from './billing.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.billing', {
    url: '/billing',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'GroupBillingCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_billing_breadcrumb'),
    },
    onEnter: /* @ngInject */ ($state, isBillingContact) => {
      if (!isBillingContact) {
        return $state.go('telecom.telephony.billingAccount');
      }

      return null;
    },
  });
};
