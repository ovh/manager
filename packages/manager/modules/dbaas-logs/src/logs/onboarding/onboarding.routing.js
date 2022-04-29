export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.onboarding', {
    url: '/onboarding',
    views: {
      logsContainer: 'dbaasLogsOnboardingComponent',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
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
  });
};
