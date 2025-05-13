export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.installation-progress',
    {
      url: '/installation/progress',
      views: {
        modal: {
          component: 'serverInstallationProgress',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
    },
  );
};
