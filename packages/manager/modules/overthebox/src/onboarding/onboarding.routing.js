export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.onboarding', {
    url: '/onboarding',
    component: 'overTheBoxOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/overTheBox').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'overTheBoxes.index' } : false,
        ),
  });
};
