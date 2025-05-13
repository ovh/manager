export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.onboarding', {
    url: '/onboarding',
    component: 'vrackOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/vrack').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'vrack.index' } : false,
        ),
  });
};
