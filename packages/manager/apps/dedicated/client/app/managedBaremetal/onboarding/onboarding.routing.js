export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.onboarding', {
    url: '/onboarding',
    component: 'managedBaremetalOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/dedicatedCloud', {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Filter': 'productReference:eq=MBM',
            },
          })
          .then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0
            ? { state: 'app.managedBaremetal.index' }
            : false,
        ),
  });
};
