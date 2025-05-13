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
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_billing_summary_title'),
    },
  });
};
