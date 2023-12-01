export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component: 'serverServiceStatusTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      },
    },
  );
};
