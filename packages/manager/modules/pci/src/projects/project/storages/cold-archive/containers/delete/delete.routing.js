import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINER_DELETE, {
    url: '/delete?containerName',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      containerName: /* @ngInject */ ($transition$) =>
        $transition$.params().containerName,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::delete`,
    },
  });
};
