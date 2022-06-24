export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('freefaxes.onboarding', {
    url: '/onboarding',
    component: 'freeFaxOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/freefax').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'freefaxes.index' } : false,
        ),
  });
};
