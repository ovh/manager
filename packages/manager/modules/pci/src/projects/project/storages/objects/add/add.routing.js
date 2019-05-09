export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.add', {
      url: '/new',
      component: 'pciProjectStorageContainersAdd',
      resolve: {
        regions: /* @ngInject */ (
          PciProjectStorageBlockService,
          projectId,
        ) => PciProjectStorageBlockService.getAvailablesRegions(projectId),
        goBack: /* @ngInject */ goToStorageContainers => goToStorageContainers,
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.storages.objects', {
          projectId,
        }),
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_storages_containers_add_title'),
      },
    });
};
