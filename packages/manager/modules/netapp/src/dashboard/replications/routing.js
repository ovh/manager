export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications', {
    url: '/replications',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppReplications',
      },
    },
    resolve: {
      getShareReplication: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/shareReplication`)
          .then(({ data }) => {
            console.info({ data });
            const mockedData = [
              {
                id: 'dacf1089-3434-4d14-a573-cac94a1ff749',
                description: 'Test share replication',
                status: 'pending',
                source: {
                  serviceID: '1956c51a-5150-4000-80db-d766fd3d6019',
                  shareID: 'c8330ff8-c8d9-48eb-8914-b105b5882ce8',
                },
                destination: {
                  serviceID: '668c3243-9c4e-4d9e-88fb-b7479058d897',
                  shareID: '7942897b-637c-4640-8af3-7e3ada2a1414',
                },
                state: 'in_sync',
                progress: '100%',
                expiresAt: '2025-05-13T13:12:38.335030',
                createdAt: '2025-05-13T13:07:38.338343',
                updatedAt: '2025-05-13T13:07:49.265341',
                deletedAt: null,
              },
              {
                id: 'dacf1089-3434-4d14-a573-cac94a1ff749',
                description: 'Test share replication',
                status: 'replicating',
                source: {
                  serviceID: '1956c51a-5150-4000-80db-d766fd3d6019',
                  shareID: 'c8330ff8-c8d9-48eb-8914-b105b5882ce8',
                },
                destination: {
                  serviceID: '668c3243-9c4e-4d9e-88fb-b7479058d897',
                  shareID: '7942897b-637c-4640-8af3-7e3ada2a1414',
                },
                state: 'in_sync',
                progress: '100%',
                expiresAt: '2025-05-13T13:12:38.335030',
                createdAt: '2025-05-13T13:07:38.338343',
                updatedAt: '2025-05-13T13:07:49.265341',
                deletedAt: null,
              },
              {
                id: 'dacf1089-3434-4d14-a573-cac94a1ff749',
                description: 'Test share replication',
                status: 'cutover',
                source: {
                  serviceID: '1956c51a-5150-4000-80db-d766fd3d6019',
                  shareID: 'c8330ff8-c8d9-48eb-8914-b105b5882ce8',
                },
                destination: {
                  serviceID: '668c3243-9c4e-4d9e-88fb-b7479058d897',
                  shareID: '7942897b-637c-4640-8af3-7e3ada2a1414',
                },
                state: 'in_sync',
                progress: '100%',
                expiresAt: '2025-05-13T13:12:38.335030',
                createdAt: '2025-05-13T13:07:38.338343',
                updatedAt: '2025-05-13T13:07:49.265341',
                deletedAt: null,
              },
              {
                id: 'dacf1089-3434-4d14-a573-cac94a1ff749',
                description: 'Test share replication',
                status: 'completed',
                source: {
                  serviceID: '1956c51a-5150-4000-80db-d766fd3d6019',
                  shareID: 'c8330ff8-c8d9-48eb-8914-b105b5882ce8',
                },
                destination: {
                  serviceID: '668c3243-9c4e-4d9e-88fb-b7479058d897',
                  shareID: '7942897b-637c-4640-8af3-7e3ada2a1414',
                },
                state: 'in_sync',
                progress: '100%',
                expiresAt: '2025-05-13T13:12:38.335030',
                createdAt: '2025-05-13T13:07:38.338343',
                updatedAt: '2025-05-13T13:07:49.265341',
                deletedAt: null,
              },
              {
                id: 'dacf1089-3434-4d14-a573-cac94a1ff749',
                description: 'Test share replication',
                status: 'error',
                source: {
                  serviceID: '1956c51a-5150-4000-80db-d766fd3d6019',
                  shareID: 'c8330ff8-c8d9-48eb-8914-b105b5882ce8',
                },
                destination: {
                  serviceID: '668c3243-9c4e-4d9e-88fb-b7479058d897',
                  shareID: '7942897b-637c-4640-8af3-7e3ada2a1414',
                },
                state: 'in_sync',
                progress: '100%',
                expiresAt: '2025-05-13T13:12:38.335030',
                createdAt: '2025-05-13T13:07:38.338343',
                updatedAt: '2025-05-13T13:07:49.265341',
                deletedAt: null,
              },
            ];

            return mockedData;
          }),
      goToVolumeDetails: /* @ngInject */ ($state, serviceName) => (volume) => {
        console.info('serviceName', serviceName, volume);
        return $state.go('netapp.dashboard.volumes.dashboard', {
          serviceName,
          volumeId: volume.id,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_replications_breadcrumb'),
    },
  });
};
