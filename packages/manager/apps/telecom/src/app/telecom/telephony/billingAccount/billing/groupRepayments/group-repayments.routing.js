import template from './group-repayments.html';
import controller from './group-repayments.controller';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.groupRepayments',
    {
      url: '/groupRepayments',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          controller,
          controllerAs: 'GroupRepaymentsCtrl',
        },
      },
    },
  );
