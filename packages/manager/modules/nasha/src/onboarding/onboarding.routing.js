export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.onboarding', {
    url: '/onboarding',
    component: 'nashaOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      cta: ($state) => $state.href('nasha.nasha-add'),
      resources: /* @ngInject */ ($http) =>
        $http.get('/dedicated/nasha').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.nasha.index' } : false,
        ),
  });
};
