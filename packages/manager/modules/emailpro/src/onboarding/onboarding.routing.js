export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.onboarding', {
    url: '/onboarding',
    component: 'emailproOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'email-pro.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/email/pro').then(({ data }) => data),
    },
  });
};
