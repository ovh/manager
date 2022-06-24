export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.onboarding', {
    url: '/onboarding',
    component: 'emailDomainsOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resouces) =>
          resouces.length > 0 ? { state: 'app.email.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/email/domain').then(({ data }) => data),
      ctaURL: ($state) => $state.href('app.mx-plan'),
    },
  });
};
