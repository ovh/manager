export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.onboarding', {
    url: '/onboarding',
    component: 'exchangeOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((instances) =>
          instances.length > 0 ? { state: 'exchange.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/exchanges', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      ctaURL: ($state) => $state.href('exchange.order'),
    },
  });
};
