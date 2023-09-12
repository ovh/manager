export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.task', {
    url: '/task',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerTask',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_task'),
    },
  });
};
