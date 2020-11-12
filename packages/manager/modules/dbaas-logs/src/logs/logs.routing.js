export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs', {
    component: 'dbaasLogs',
    url: '/dbaas/logs',
    redirectTo: 'dbaas-logs.list',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      angularWebsocket: /* @ngInject */ ($ocLazyLoad) =>
        import('script-loader!angular-websocket/dist/angular-websocket').then(
          () => {
            $ocLazyLoad.inject('angular-websocket');
          },
        ),
      me: /* @ngInject */ ($http) =>
        $http
          .get('/me')
          .then(({ data }) => data)
          .catch(() => {}),
    },
  });
};
