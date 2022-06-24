export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.onboarding', {
    url: '/onboarding',
    component: 'packXdslOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/pack/xdsl').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'telecom.packs.index' } : false,
        ),
  });
};
