export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.onboarding', {
    url: '/onboarding',
    component: 'dedicatedCloudsOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'app.dedicatedCloud.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/dedicatedCloud').then(({ data }) => data),
    },
  });
};
