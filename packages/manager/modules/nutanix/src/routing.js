export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.index', {
    url: '',
    component: 'clusterComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('clusters')
        .then((services) =>
          services.length === 0
            ? {
                state: 'nutanix.onboarding',
              }
            : false,
        ),
    resolve: {
      clusters: /* @ngInject */ (NutanixService) =>
        NutanixService.getClusters(),
      nodeDetails: /* @ngInject */ (clusters, NutanixService) =>
        NutanixService.getServer(clusters[0].getFirstNode()),
      getClusterDetailsState: /* @ngInject */ ($state) => (serviceName) =>
        $state.href('nutanix.dashboard.general-info', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
