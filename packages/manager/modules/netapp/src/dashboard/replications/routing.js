import { REPLICATIONS_STATUS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.replications', {
    url: '/replications',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppReplications',
      },
    },
    resolve: {
      sourceEfsNames: /* @ngInject */ ($http) =>
        $http
          .get('/storage/netapp')
          .then(({ data = [] }) =>
            data.reduce((prev, { id, name }) => ({ ...prev, [id]: name }), {}),
          ),
      replications: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/shareReplication`)
          .then(({ data = [] }) =>
            Object.groupBy(data, ({ status }) =>
              status === REPLICATIONS_STATUS.COMPLETED
                ? REPLICATIONS_STATUS.COMPLETED
                : REPLICATIONS_STATUS.ONGOING,
            ),
          ),
      goToVolumeDetails: /* @ngInject */ ($state, serviceName) => (volumeId) =>
        $state.go('netapp.dashboard.volumes.dashboard', {
          serviceName,
          volumeId,
        }),
      goToService: /* @ngInject */ ($state) => () =>
        $state.go('netapp.dashboard.index'),
      currentServiceName: /* @ngInject */ (serviceName) => serviceName,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_replications_breadcrumb'),
    },
  });
};
