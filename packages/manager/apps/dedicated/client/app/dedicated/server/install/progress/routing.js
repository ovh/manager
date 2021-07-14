export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.install.progress',
    {
      url: '/progress',
      layout: 'modal',
      component: 'dedicatedServerInstallProgress',
      resolve: {
        goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
        user: /* @ngInject */ (currentUser) => currentUser,
        breadcrumb: /* @ngInject */ () => null,
      },
    },
  );
};
