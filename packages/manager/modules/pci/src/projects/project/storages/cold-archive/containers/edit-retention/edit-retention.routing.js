import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_EDIT_RETENTION,
    {
      url: '/edit-retention',
      atInternet: {
        rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}`,
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
          component: 'pciStoragesColdArchiveContainersEditRetention',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,

        container: /* @ngInject */ ($transition$) =>
          $transition$.params().container,
      },
    },
  );
};
