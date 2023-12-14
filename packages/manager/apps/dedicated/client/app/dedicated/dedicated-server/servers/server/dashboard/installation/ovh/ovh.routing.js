export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.installation-ovh',
    {
      url: '/installation/ovh',
      views: {
        modal: {
          component: 'serverInstallationOvh',
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
