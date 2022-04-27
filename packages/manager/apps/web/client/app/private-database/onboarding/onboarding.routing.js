export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.onboarding', {
    url: '/onboarding',
    component: 'privateDatabasesOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0
            ? { state: 'app.private-database.index' }
            : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/hosting/privateDatabase').then(({ data }) => data),
      ctaURLs: /* @ngInject */ ($state) => [
        $state.href('app.private-database-order-clouddb'),
        $state.href('app.private-database.order'),
      ],
    },
  });
};
