export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.onboarding', {
    url: '/onboarding',
    views: {
      vpsContainer: 'vpsOnboardingComponent',
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/vps').then(({ data }) => data),
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('resources')
        .then((resources) => {
          return resources.length > 0 ? 'vps.index' : false;
        });
    },
  });
};
