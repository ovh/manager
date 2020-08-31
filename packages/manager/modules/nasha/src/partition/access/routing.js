export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partition-access', {
    url: '/access/:partitionName',
    views: {
      nashaPartitionAccess: {
        component: 'nashaPartitionAccessComponent',
      },
    },
    translations: {
      value: ['../../../common', '.'],
      format: 'json',
    },
    params: {
      access: null,
      task: null,
      isNew: null,
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().nashaId,
      partition: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
      partitionDetails: /* @ngInject */ (
        OvhApiDedicatedNasha,
        partition,
        serviceName,
      ) =>
        OvhApiDedicatedNasha.Partition()
          .v6()
          .get({
            serviceName,
            partitionName: partition,
          }).$promise,
      access: /* @ngInject */ ($transition$) => $transition$.params().access,
      task: /* @ngInject */ ($transition$) => $transition$.params().task,
      isNew: /* @ngInject */ ($transition$) => $transition$.params().isNew,
      goToPartitionAccessAddPage: /* @ngInject */ (
        $state,
        serviceName,
        partition,
      ) => () =>
        $state.go('nasha.dashboard.nasha-partition-access.add', {
          serviceName,
          partition,
        }),
      goToPartitionAccessDeletePage: /* @ngInject */ (
        $state,
        serviceName,
        partition,
      ) => (access) =>
        $state.go('nasha.dashboard.nasha-partition-access.delete', {
          serviceName,
          partition,
          access,
        }),
      goToPartitionAccessPage: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
      ) => {
        const state = 'nasha.dashboard.nasha-partition-access';
        const promise = $state.go(state, data);
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
    },
  });
};
