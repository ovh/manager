export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.update-reverse-dns',
    {
      url: '/update-reverse-dns',
      views: {
        modal: {
          component: 'serverReverseDnsUpdate',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
