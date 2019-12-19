export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.add', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_projects_project_instances_add_title'),

      privateNetworks: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPrivateNetworks(projectId),

      publicNetwork: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPublicNetwork(projectId),

      regions: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getAvailablesRegions(projectId),

      cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.instances', {
        projectId,
      }),

      quotaLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.quota', {
        projectId,
      }),

      goBack: /* @ngInject */ (goToInstances) => goToInstances,

      prices: /* @ngInject */ (
        me,
        PciProjectsProjectInstanceService,
        project,
      ) => PciProjectsProjectInstanceService.getExtraBandwidthCost(project, me),
    },
  });
};
