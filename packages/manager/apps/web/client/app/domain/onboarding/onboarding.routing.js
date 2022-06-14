export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.onboarding', {
    url: '/onboarding',
    component: 'domainsOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.domain.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/domain').then(({ data }) => data),
    },
  });
};
