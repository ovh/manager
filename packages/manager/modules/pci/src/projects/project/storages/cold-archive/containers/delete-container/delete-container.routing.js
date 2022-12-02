import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
} from './delete-container.constants';

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
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::delete-container`,
    },
  });
};
