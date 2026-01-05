import replicationsModal from '../../../components/replications-modal';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications.approuve', {
    url: '/approuve',
    views: {
      modal: {
        component: replicationsModal,
      },
    },
    layout: 'modal',
    params: {
      destinationServiceID: null,
      replicationID: null,
      sourceShareID: null,
    },
    resolve: {
      modalType: /* @ngInject */ () => 'approuve',
      params: /* @ngInject */ ($transition$) => $transition$.params(),
      isPrimaryDisabled: /* @ngInject */ (params) =>
        !params.destinationServiceID ||
        !params.sourceShareID ||
        !params.replicationID,
      onPrimaryClick: /* @ngInject */ (
        $http,
        params,
        Alerter,
        $translate,
        $state,
      ) => () => {
        const { sourceShareID, destinationServiceID, replicationID } = params;
        const onError = () => {
          Alerter.error(
            $translate.instant('netapp_replications_approuve_error', {
              sourceShareID,
            }),
          );
          return $state.go('netapp.dashboard.replications');
        };

        return $http
          .get(`/storage/netapp/${destinationServiceID}/share/${sourceShareID}`)
          .catch(() => onError())
          .then(({ data: { size } }) =>
            $http
              .post(
                `/storage/netapp/${destinationServiceID}/shareReplication/${replicationID}/accept`,
                {
                  share: {
                    protocol: 'NFS',
                    size,
                  },
                },
              )
              .then(() =>
                $state.go(
                  'netapp.dashboard.replications',
                  {},
                  {
                    reload: true,
                  },
                ),
              )
              .catch(() => onError()),
          );
      },
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
