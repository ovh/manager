import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINER_RESTORE, {
    url: '/restore?containerName',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersRestore',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      containerName: /* @ngInject */ ($transition$) =>
        $transition$.params().containerName,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::restore`,
    },
  });
};
