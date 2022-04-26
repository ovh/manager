export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.onboarding', {
    url: '/onboarding',
    component: 'officeOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'office.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/license/office').then(({ data }) => data),
    },
  });
};
