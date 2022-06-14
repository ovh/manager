export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.onboarding', {
    url: '/onboarding',
    component: 'sharepointOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'sharepoint.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/sharepoints', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      ctaURL: ($state) => $state.href('sharepoint.order'),
    },
  });
};
