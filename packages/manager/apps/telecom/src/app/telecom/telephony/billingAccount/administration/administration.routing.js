import template from './administration.html';
import controller from './administration.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.administration', {
    url: '/administration',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'BillingAccountAdministrationCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_admin_breadcrumb'),
    },
  });
};
