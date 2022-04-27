export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.onboarding', {
    url: '/onboarding',
    component: 'zonesOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.zone.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/domain/zone').then(({ data }) => data),
      ctaURL: ($state) => $state.href('app.zone.new'),
    },
  });
};
