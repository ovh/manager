export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.install.progress', {
    url: '/progress',
    layout: 'modal',
    component: 'dedicatedServerInstallProgress',
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
