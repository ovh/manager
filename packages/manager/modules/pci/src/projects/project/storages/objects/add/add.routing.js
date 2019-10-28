import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.add', {
      url: '/new',
      component: 'pciProjectStorageContainersAdd',
      resolve: {
        regions: /* @ngInject */ (
          PciProjectRegions,
          projectId,
        ) => PciProjectRegions
          .getAvailableRegions(projectId).then((regions) => {
            const supportedRegions = filter(regions,
              region => some(get(region, 'services', []), { name: 'storage', status: 'UP' }));
            return map(supportedRegions, region => ({
              ...region,
              hasEnoughQuota: () => true,
            }));
          }),
        goBack: /* @ngInject */ goToStorageContainers => goToStorageContainers,
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.storages.objects', {
          projectId,
        }),
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_storages_containers_add_title'),
      },
    });
};
