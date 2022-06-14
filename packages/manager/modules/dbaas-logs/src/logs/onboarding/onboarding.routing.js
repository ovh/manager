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
        .getAsync('logs')
        .then((logs) => (logs.length > 0 ? 'dbaas-logs.list' : false)),
  });
};
