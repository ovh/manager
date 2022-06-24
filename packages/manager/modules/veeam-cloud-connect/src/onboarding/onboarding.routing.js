export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('veeam-cloud-connect.onboarding', {
    url: '/onboarding',
    views: {
      veeamContainer: {
        component: 'veeamOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ (iceberg) =>
        iceberg('/veeamCloudConnect')
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length ? { state: 'veeam-cloud-connect.index' } : false,
        ),
  });
};
