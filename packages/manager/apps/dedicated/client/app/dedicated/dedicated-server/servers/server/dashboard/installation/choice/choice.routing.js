export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.installation-choice',
    {
      url: '/installation/choice',
      views: {
        modal: {
          component: 'serverInstallationChoice',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
