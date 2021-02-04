export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.cancel-commitment', {
    url: '/cancel-commitment',
    views: {
      modal: {
        component: 'billingCancelCommitment',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      trackClick: /* @ngInject */ (atInternet) => () =>
        atInternet.trackClick({
          name: 'cancel-commitment::confirm',
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'server',
          chapter3: 'dashboard',
        }),
    },
  });
};
