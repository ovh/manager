export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.onboarding', {
    url: '/onboarding',
    component: 'hostingsOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.hosting.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/hosting/web').then(({ data }) => data),
    },
  });
};
