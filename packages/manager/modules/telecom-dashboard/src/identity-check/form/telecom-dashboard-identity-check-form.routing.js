export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('identity-check', {
    url: '/identity-check',
    component: 'identityCheckForm',
    atInternet: {
      rename: 'telecom::telephony::account-validation',
    },
    resolve: {
      $title: ($translate) =>
        $translate('telecom_dashboard_identity_check_form_title'),
      hideBreadcrumb: () => true,
      goToDashboard: /* @ngInject */ ($state) => () =>
        $state.go('telecom-dashboard'),
      goToModalCancelProcedure: /* @ngInject */ ($state) => (procedureId) =>
        $state.go('identity-check.cancellation', { procedureId }),
      trackClick: /* @ngInject */ (atInternet) => (nameClick) =>
        atInternet.trackClick({
          name: `telecom::telephony::account-validation::${nameClick}`,
          type: 'action',
        }),
      trackPage: /* @ngInject */ (atInternet) => (namePage) =>
        atInternet.trackPage({
          name: `telecom::telephony::${namePage}`,
        }),
    },
  });
};
