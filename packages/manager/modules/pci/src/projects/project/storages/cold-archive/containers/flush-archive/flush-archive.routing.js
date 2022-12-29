import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from './flush-archive.constants';

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
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::flush-archive`,
    },
  });
};
