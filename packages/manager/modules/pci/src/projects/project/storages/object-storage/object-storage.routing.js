import { PCI_FEATURES } from '../../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage', {
    url: '/objects',
    component: 'pciProjectStorageObjectStorage',
    params: {
      trackingTag: null,
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.OBJECT_STORAGE);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containersResponseObj')
        .then(({ resources, errors }) =>
          resources.length === 0 && errors.length === 0
            ? {
                state:
                  'pci.projects.project.storages.object-storage.onboarding',
              }
            : { state: 'pci.projects.project.storages.object-storage.objects' },
        ),
    resolve: {
      archive: () => false,
      tagPageParams: /* @ngInject */ ($transition$) =>
        $transition$.params().trackingTag,

      trackingPrefix: () =>
        'PublicCloud::pci::projects::project::storages::objects::',
      containersResponseObj: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) =>
        PciProjectStorageContainersService.getAll(
          projectId,
          archive,
          false,
          true,
        ),

      containers: /* @ngInject */ (containersResponseObj) =>
        containersResponseObj.resources,

      containersRegions: /* @ngInject */ (containers) =>
        Array.from(new Set(containers.map(({ region }) => region))),

      containersLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.object-storage.objects', {
          projectId,
        }),

      userList: /* @ngInject */ (projectId, allUserList) =>
        allUserList.filter((user) => user?.s3Credentials?.length > 0),

      allUserList: /* @ngInject */ (
        projectId,
        PciStoragesObjectStorageService,
      ) =>
        PciStoragesObjectStorageService.getAllS3Users(projectId).then((users) =>
          PciStoragesObjectStorageService.mapUsersToCredentials(
            projectId,
            users,
          ),
        ),

      isUserTabActive: /* @ngInject */ ($transition$, $state) => () => {
        return $state
          .href($state.current.name, $transition$.params())
          .includes('users');
      },

      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.object-storage.users', {
          projectId,
        }),

      onGuideLinkClick: /* @ngInject */ (atInternet, trackingPrefix) => () =>
        atInternet.trackClick({
          name: `${trackingPrefix}onboarding::documentation::object_guide`,
          type: 'action',
        }),

      goToStorageContainers: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.object-storage.objects',
          {
            projectId,
          },
          {
            reload,
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

      goBackWithTrackingPage: /* @ngInject */ (
        $state,
        projectId,
        CucCloudMessage,
      ) => ({
        message = false,
        type = 'success',
        reload = undefined,
        trackingTag = null,
      }) => {
        const promise = $state.go(
          'pci.projects.project.storages.object-storage.objects',
          { projectId, trackingTag },
          {
            reload:
              reload === undefined ? message && type === 'success' : reload,
          },
        );

        if (message) {
          promise.then(() => {
            return CucCloudMessage[type](
              message,
              'pci.projects.project.storages.containers.container',
            );
          });
        }
        return promise;
      },
      trackPage: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackPage({
          name: `PublicCloud_object_storage${hit}`,
        }),

      breadcrumb: () => null,
    },
  });
};
