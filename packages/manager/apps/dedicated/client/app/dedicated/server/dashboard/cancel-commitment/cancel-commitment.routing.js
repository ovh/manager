export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.cancel-commitment',
    {
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
        confirmCancelTracking: () =>
          'dedicated::dedicated::server::dashboard::cancel-commitment::confirm',
        breadcrumb: () => null,
      },
    },
  );
};
