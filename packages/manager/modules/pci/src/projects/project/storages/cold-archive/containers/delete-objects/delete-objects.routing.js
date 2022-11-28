import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_OBJECTS_DELETE,
    {
      url: '/delete-objects?containerName',
      views: {
        modal: {
          component: 'pciStoragesColdArchiveContainersDeleteObjects',
        },
      },
      params: {
        container: null,
      },
      layout: 'modal',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('container')
          .then((container) =>
            !container ? { state: COLD_ARCHIVE_STATES.CONTAINERS } : false,
          ),
      resolve: {
        breadcrumb: () => null,

        container: /* @ngInject */ ($transition$) =>
          $transition$.params().container,
      },
      atInternet: {
        rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::delete-objects`,
      },
    },
  );
};
