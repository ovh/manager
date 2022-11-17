import { COLD_ARCHIVE_TRACKING_PREFIX } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.containers.delete',
    {
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
    },
  );
};
