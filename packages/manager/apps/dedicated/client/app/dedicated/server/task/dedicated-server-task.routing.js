export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.task', {
    url: '/task',
    views: {
      'tabView@app.dedicated-server.server': 'dedicatedServerTask',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_task'),
    },
  });
};
