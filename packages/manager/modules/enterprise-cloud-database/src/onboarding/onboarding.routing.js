import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.onboarding', {
    url: '/onboarding',
    component: 'enterpriseCloudDatabaseOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ (
        $q,
        enterpriseCloudDatabaseService,
        getClusterDetails,
      ) =>
        enterpriseCloudDatabaseService
          .getClusters()
          .then((clusters) =>
            $q.all(clusters.map((clusterId) => getClusterDetails(clusterId))),
          ),
      getClusterDetails: /* @ngInject */ (
        capabilities,
        enterpriseCloudDatabaseService,
      ) => (clusterId) =>
        enterpriseCloudDatabaseService
          .getClusterDetails(clusterId)
          .then((details) => ({
            offer: find(capabilities, { name: details.offerName }),
            details,
          })),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'enterprise-cloud-database' } : false,
        ),
  });
};
