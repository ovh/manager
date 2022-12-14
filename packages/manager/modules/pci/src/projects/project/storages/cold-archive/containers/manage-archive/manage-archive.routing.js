import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  COLD_ARCHIVE_STATES,
  REGION,
} from '../../cold-archives.constants';

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
      endpoint: /* @ngInject */ (PciStoragesColdArchiveService, projectId) => {
        try {
          return PciStoragesColdArchiveService.getArchiveEndpoint(
            projectId,
            REGION,
          ).then(({ data }) => {
            return data?.services[0]?.endpoint;
          });
        } catch (err) {
          return '';
        }
      },
      region: () => REGION,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::manage-archive`,
    },
  });
};
