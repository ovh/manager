export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.update-reverse-dns',
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
