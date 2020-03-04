export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.onboarding', {
    url: '/onboarding',
    component: 'pciProjectBaremetalOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('instances')
        .then((instances) =>
          instances.length > 0
            ? { state: 'pci.projects.project.baremetal' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addInstance: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.baremetal.add', {
          projectId,
        }),
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      isEnabled: /* @ngInject */ (OvhApiCloudProjectRegion, projectId) =>
        OvhApiCloudProjectRegion.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then((regions) => regions.includes('BHS-IRONIC-LAB')),
    },
  });
};
