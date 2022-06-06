export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.administration', {
    url: '/administration',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        component: 'telecomBillingAccountAdministrationComponent',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_admin_breadcrumb'),

      canResetWhiteLabelManagerPassword: /* @ngInject */ (
        telecomBillingAccountAdministrationService,
      ) => telecomBillingAccountAdministrationService.resellerPanelStatus(),
    },
  });
};
