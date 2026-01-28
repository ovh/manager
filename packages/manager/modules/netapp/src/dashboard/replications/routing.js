import { REPLICATION_API_STATUS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications', {
    url: '/replications',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppReplications',
      },
    },
    resolve: {
      sourceEFSNames: /* @ngInject */ ($http) =>
        $http
          .get('/storage/netapp')
          .then(({ data = [] }) =>
            data.reduce((prev, { id, name }) => ({ ...prev, [id]: name }), {}),
          ),
      replications: /* @ngInject */ ($http, $q, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/shareReplication`)
          .catch(() => [])
          .then(({ data = [] }) =>
            $q
              .all(
                data.reduce((prev, { id, status }) => {
                  const promise =
                    status === REPLICATION_API_STATUS.accepted &&
                    $http.get(
                      `/storage/netapp/${serviceName}/shareReplication/${id}`,
                    );

                  return promise ? [...prev, promise] : prev;
                }, []),
              )
              .then((acceptedShareReplications) => {
                return data.map(
                  (replication) =>
                    acceptedShareReplications.find(
                      ({ data: { id } }) => id === replication.id,
                    )?.data || replication,
                );
              }),
          ),
      goToApprouveReplication: /* @ngInject */ ($state) => ({
        destinationServiceID,
        replicationID,
        sourceShareID,
      }) => {
        $state.go('netapp.dashboard.replications.approuve', {
          destinationServiceID,
          replicationID,
          sourceShareID,
        });
      },
      goToPromoteReplication: /* @ngInject */ ($state) => ({ replication }) => {
        $state.go('netapp.dashboard.replications.promote', {
          replicationID: replication.id,
          sourceShareID: replication.source.shareID,
        });
      },
      goToDeleteReplication: /* @ngInject */ ($state) => ({ replication }) => {
        $state.go('netapp.dashboard.replications.delete', {
          replicationID: replication.id,
          status: replication.status,
          sourceShareID: replication.source.shareID,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_replications_breadcrumb'),
    },
  });
};
