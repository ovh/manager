export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.onboarding', {
    url: '/onboarding',
    views: {
      '': {
        component: 'cdnOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/cdn/dedicated').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.networks.cdn.index' } : false,
        ),
  });
};
