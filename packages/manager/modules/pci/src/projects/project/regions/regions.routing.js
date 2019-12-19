import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.regions', {
      url: '/regions',
      component: 'pciProjectRegions',
      resolve: {
        availableRegions: /* @ngInject */ (
          CucRegionService,
          OvhApiCloudProjectRegion,
          projectId,
        ) => OvhApiCloudProjectRegion.AvailableRegions().v6()
          .query({ serviceName: projectId })
          .$promise
          .then((regionIds) => map(regionIds, (region) => CucRegionService.getRegion(region.name))),

        regions: /* @ngInject */ (
          CucRegionService,
          OvhApiCloudProjectRegion,
          projectId,
        ) => OvhApiCloudProjectRegion.v6()
          .query({ serviceName: projectId })
          .$promise
          .then((regionIds) => map(regionIds, (region) => CucRegionService.getRegion(region))),

        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_projects_project_regions'),
      },
    });
};
