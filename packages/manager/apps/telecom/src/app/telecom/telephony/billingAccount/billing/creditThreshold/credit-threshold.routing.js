import template from './credit-threshold.html';
import controller from './credit-threshold.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.creditThreshold',
    {
      url: '/creditThreshold',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          template,
          controller,
          controllerAs: 'BillingAccountCreditThresholdCtrl',
        },
      },
    },
  );
};
