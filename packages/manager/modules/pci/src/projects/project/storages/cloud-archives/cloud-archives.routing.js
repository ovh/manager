import { PCI_FEATURES } from '../../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.archives', {
    url: '/cloud-archives?id',
    component: 'pciProjectStorageContainers',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
      trackingTag: null,
    },
    onEnter: /* @ngInject */ ($transition$) => {
      return Promise.all([
        $transition$.injector().getAsync('pciFeatureRedirect'),
      ]).then(([pciFeatureRedirect]) =>
        pciFeatureRedirect(PCI_FEATURES.PRODUCTS.CLOUD_ARCHIVE),
      );
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? { state: 'pci.projects.project.storages.archives.onboarding' }
            : false,
        ),
    resolve: {
      archive: () => true,
      containerId: /* @ngInject */ ($transition$) => $transition$.params().id,
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),

      containersRegions: /* @ngInject */ (containers) =>
        Array.from(new Set(containers.map(({ region }) => region))),

      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.archives.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.archives.archive', {
          projectId,
          containerId: container.id,
        }),
      deleteContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.archives.delete', {
          projectId,
          containerId: container.id,
        }),
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href('pci.projects.project.storages.archives.archive', {
          projectId,
          containerId: container.id,
        }),

      trackingTag: /* @ngInject */ ($transition$) =>
        $transition$.params().trackingTag,

      goBackWithTrackingPage: /* @ngInject */ (goToStorageContainers) => ({
        message = false,
        type = 'success',
        trackingTag = null,
      }) => {
        return goToStorageContainers(message, type, { trackingTag });
      },

      goToStorageContainers: /* @ngInject */ (
        $rootScope,
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success', params = {}) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.archives',
          {
            projectId,
          },
          {
            reload,
            ...params,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.storages.containers.container',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_archive_title',
        ),

      regions: /* @ngInject */ (PciProjectRegions, projectId) =>
        PciProjectRegions.getAvailableRegions(projectId).then((regions) => {
          return regions.reduce((acc, region) => {
            acc[region.name] = region;
            return acc;
          }, {});
        }),

      catalog: /* @ngInject */ (PciStoragesObjectStorageService) =>
        PciStoragesObjectStorageService.getCatalog(),
    },
  });
};
