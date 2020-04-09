export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.order-legacy', {
    url: '/orderLegacy',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      goToOrganisation: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) => $state.go('app.ip.organisation', params, transitionParams),
    },
    views: {
      modal: {
        component: 'ipDashboardOrderLegacy',
      },
    },
    layout: 'modal',
  });
};
