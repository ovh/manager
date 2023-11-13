import { S3_GUIDES_SECTION } from './datastore.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.datastore', {
    url: '/datastore',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardDatastore',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
      regions: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getRegions(projectId),
      goToObjectStorageUsers: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.users', {
          projectId,
        }),
      s3Guides: /* @ngInject */ (AiDashboardService, projectId, coreConfig) =>
        AiDashboardService.getGuides(
          projectId,
          coreConfig
            .getUserLocale()
            .replace('_', '-')
            .toLowerCase(),
          S3_GUIDES_SECTION,
        ),
      goToCreateDatastore: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.ai-dashboard.datastore.create-datastore',
          {
            projectId,
          },
        ),
      goBackToDatastore: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.ai-dashboard.datastore';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      goToDeleteDatastore: /* @ngInject */ ($state, projectId) => (
        datastore,
        region,
      ) =>
        $state.go(
          'pci.projects.project.ai-dashboard.datastore.delete-datastore',
          {
            projectId,
            datastoreId: datastore.alias,
            regionId: region.id,
          },
        ),
    },
  });
};
