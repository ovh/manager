import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from './restore.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_RESTORE, {
    url: '/restore?containerName',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('container')
        .then((container) =>
          !container ? { state: COLD_ARCHIVE_STATES.CONTAINERS } : false,
        ),
    params: {
      container: null,
    },
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersRestore',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      container: /* @ngInject */ ($transition$) =>
        $transition$.params().container,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::restore`,
    },
  });
};
