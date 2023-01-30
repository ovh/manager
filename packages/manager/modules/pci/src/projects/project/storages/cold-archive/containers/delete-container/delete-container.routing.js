import {
  COLD_ARCHIVE_STATES,
  COLD_ARCHIVE_TRACKING,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_DELETE, {
    url: '/delete-container',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersDeleteContainer',
      },
    },
    layout: 'modal',
    params: {
      container: null,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}`,
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

      container: /* @ngInject */ ($transition$) =>
        $transition$.params().container,
    },
  });
};
