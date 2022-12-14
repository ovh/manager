import {
  COLD_ARCHIVE_DEFAULT_REGION,
  COLD_ARCHIVE_STATES,
  COLD_ARCHIVE_TRACKING_PREFIX,
} from './delete-objects.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_OBJECTS_DELETE,
    {
      url: '/delete-objects',
      views: {
        modal: {
          component: 'pciStoragesColdArchiveContainersDeleteObjects',
        },
      },
      layout: 'modal',
      params: {
        projectId: null,
        container: null,
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('container')
          .then((container) =>
            !container ? { state: COLD_ARCHIVE_STATES.CONTAINERS } : false,
          ),
      resolve: {
        breadcrumb: () => null,

        projectId: /* @ngInject */ ($transition$) =>
          $transition$.params().projectId,

        container: /* @ngInject */ ($transition$) =>
          $transition$.params().container,

        objects: /* @ngInject */ (
          projectId,
          container,
          PciStoragesColdArchiveService,
        ) =>
          PciStoragesColdArchiveService.getArchiveContainer(
            projectId,
            COLD_ARCHIVE_DEFAULT_REGION,
            container.name,
          ).then(({ objects }) => objects),
      },
      atInternet: {
        rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::delete-objects`,
      },
    },
  );
};
