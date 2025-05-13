import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.archives.add', {
    url: '/new',
    component: 'pciProjectStorageContainersAdd',
    resolve: {
      regions: /* @ngInject */ (
        $http,
        $q,
        coreConfig,
        PciProjectRegions,
        projectId,
      ) => {
        const CLOUD_ARCHIVE_PLAN_CODE = 'archive.consumption';
        return $q
          .all([
            PciProjectRegions.getAvailableRegions(projectId),
            $http.get(`/cloud/order/rule/availability`, {
              params: {
                ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
                planCode: CLOUD_ARCHIVE_PLAN_CODE,
              },
            }),
          ])
          .then(([projectRegions, { data: availability }]) => {
            const cloudArchiveRegions =
              availability.plans.find(
                (plan) => plan.code === CLOUD_ARCHIVE_PLAN_CODE,
              )?.regions || [];
            const supportedRegions = projectRegions.filter((region) => {
              return (
                some(get(region, 'services', []), {
                  name: 'storage',
                  status: 'UP',
                }) && cloudArchiveRegions.includes(region.name)
              );
            });
            return map(supportedRegions, (region) => ({
              ...region,
              hasEnoughQuota: () => true,
            }));
          });
      },
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      cancelCreate: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.archives', {
          projectId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_add_archive_title',
        ),
    },
  });
};
