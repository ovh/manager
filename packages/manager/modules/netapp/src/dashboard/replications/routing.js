import { ACCEPTED_REPLICATION_STATE } from './constants';

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
                    status === 'accepted' &&
                    $http
                      .get(
                        `/storage/netapp/${serviceName}/shareReplication/${id}`,
                      )
                      .then(({ data: { replicaState } }) => ({
                        replicaState,
                        id,
                      }));

                  return promise ? [...prev, promise] : prev;
                }, []),
              )
              .then((acceptedShareReplications) => {
                const getAcceptedStatus = (replicationId) => {
                  const replicaState = acceptedShareReplications.find(
                    ({ id }) => replicationId === id,
                  )?.replicaState;

                  if (replicaState === 'error')
                    return ACCEPTED_REPLICATION_STATE.ERROR;
                  if (replicaState === 'in_sync')
                    return ACCEPTED_REPLICATION_STATE.IN_SYNC;
                  if (replicaState === 'out_of_sync')
                    return ACCEPTED_REPLICATION_STATE.OUT_OF_SYNC;
                  return '';
                };
                return data.map((replication) => ({
                  ...replication,
                  ...(replication.status === 'accepted' && {
                    status: getAcceptedStatus(replication.id),
                  }),
                }));
              }),
          ),
      gotoApprouveReplication: /* @ngInject */ ($state) => ({
        destinationServiceID,
        replicationID,
        sourceShareID,
      }) =>
        $state.go('netapp.dashboard.replications.approuve', {
          destinationServiceID,
          replicationID,
          sourceShareID,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_replications_breadcrumb'),
    },
  });
};
