export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.onboarding', {
    url: '/onboarding',
    views: {
      iplbContainer: {
        component: 'iplbOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/ipLoadbalancing').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'iplb.index' } : false,
        ),
  });
};
