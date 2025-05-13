import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ADD_USER, {
    url: '/add-user',
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}`,
    },
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
        component: 'pciProjectStorageColdArchiveContainersAddUser',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      container: /* @ngInject */ ($transition$) =>
        $transition$.params().container,
    },
  });
};
