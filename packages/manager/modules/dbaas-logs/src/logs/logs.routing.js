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
      me: /* @ngInject */ ($http) =>
        $http
          .get('/me')
          .then(({ data }) => data)
          .catch(() => {}),
    },
  });
};
