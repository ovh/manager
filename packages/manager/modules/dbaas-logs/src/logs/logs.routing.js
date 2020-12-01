export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs', {
    component: 'dbaasLogs',
    url: '/dbaas/logs',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('OvhApiDbaas')
        .then((OvhApiDbaas) =>
          OvhApiDbaas.Logs()
            .v6()
            .query()
            .$promise.then((result) => {
              return result.length > 0
                ? 'dbaas-logs.list'
                : 'dbaas-logs.onboarding';
            })
            .catch(() => {
              return 'dbaas-logs.onboarding';
            }),
        ),
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
      orderLink: /* @ngInject */ ($state) => $state.href('dbaas-logs.order'),
    },
  });
};
