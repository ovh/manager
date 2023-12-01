export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.installation-gabarit',
    {
      url: '/installation/gabarit',
      views: {
        modal: {
          component: 'serverInstallationGabarit',
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
