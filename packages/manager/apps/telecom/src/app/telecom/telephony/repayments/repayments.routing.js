import controller from './repayments.controller';
import template from './repayments.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.repayments', {
    url: '/repayments',
    views: {
      'telephonyView@telecom.telephony': {
        controller,
        template,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_repayments_title'),
    },
  });
};
