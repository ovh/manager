import { COLD_ARCHIVE_STATES } from './archive.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ARCHIVE, {
    url: '/archive',
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
        component: 'pciStoragesColdArchiveContainersArchive',
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
