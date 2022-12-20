import { COLD_ARCHIVE_STATES, REGION } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_MANAGE, {
    url: '/manage',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersManageContainer',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      endpoint: /* @ngInject */ (PciStoragesColdArchiveService, projectId) =>
        PciStoragesColdArchiveService.getArchiveRegionDetails(projectId, REGION)
          .then(({ data }) => data?.services[0]?.endpoint)
          .catch(() => ''),
      region: () => REGION,
    },
  });
};
