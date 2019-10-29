import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.add', {
      url: '/new',
      component: 'pciProjectStorageContainersAdd',
      resolve: {
        regions: /* @ngInject */ (
          PciProjectRegions,
          projectId,
        ) => PciProjectRegions
          .getAvailableRegions(projectId).then(regions => map(regions, region => ({
            ...region,
            hasEnoughQuota: () => true,
          }))),
        goBack: /* @ngInject */ goToStorageContainers => goToStorageContainers,
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.storages.archives', {
          projectId,
        }),
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_storages_containers_add_archive_title'),
      },
    });
};
