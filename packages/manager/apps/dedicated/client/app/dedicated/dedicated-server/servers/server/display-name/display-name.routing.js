export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.edit-display-name',
    {
      url: '/display-name',
      views: {
        modal: {
          component: 'serverDisplayName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
