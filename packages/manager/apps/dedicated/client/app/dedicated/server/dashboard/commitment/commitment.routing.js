export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.commitment', {
    url: '/commitment?duration',
    views: {
      'dashboard@app.dedicated.server.dashboard': 'billingCommitment',
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      duration: /* @ngInject */ ($transition$) =>
        $transition$.params().duration,
      serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      me: /* @ngInject */ (currentUser) => currentUser,
      trackingPrefix: () => 'dedicated::server::dashboard',
    },
  });
};
