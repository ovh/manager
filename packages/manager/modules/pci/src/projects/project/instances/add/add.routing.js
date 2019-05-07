export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.add', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_instances_add_title'),

      privateNetworks: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPrivateNetworks(projectId),

      regions: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getAvailablesRegions(projectId),

      cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.instances', {
        projectId,
      }),

      goBack: /* @ngInject */ goToInstances => goToInstances,
    },
  });
};
