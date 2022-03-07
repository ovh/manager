export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.onboarding', {
    url: '/onboarding',
    views: {
      cdaDetails: {
        component: 'cdaOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/dedicated/ceph').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.cda.index' } : false,
        ),
  });
};
