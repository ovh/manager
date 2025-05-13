import {
  COLD_ARCHIVE_STATES,
  COLD_ARCHIVE_TRACKING,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_ARCHIVE_FLUSH, {
    url: '/flush-archive',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersFlushArchive',
      },
    },
    layout: 'modal',
    params: {
      container: null,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}`,
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
