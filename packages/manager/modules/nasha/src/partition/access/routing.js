export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('nasha.nasha-partition-access', {
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
      resolve: {
        serviceName: /* @ngInject */ $transition$ => $transition$.params().nashaId,
        partition: /* @ngInject */ $transition$ => $transition$.params().partitionName,
        goToPartitionAccessAddPage: /* @ngInject */ ($state, serviceName, partition) => () => $state.go('nasha.nasha-partition-access.add', {
          serviceName,
          partition,
        }),
        goToPartitionAccessDeletePage: /* @ngInject */ ($state, serviceName, partition) => access => $state.go('nasha.nasha-partition-access.delete', {
          serviceName,
          partition,
          access,
        }),
        goToPartitionAccessPage: /* @ngInject */ ($state, CucCloudMessage) => (message = false,
          type = 'success') => {
          const reload = message && type === 'success';
          const state = 'nasha.nasha-partition-access';
          const promise = $state.go(state,
            {
              reload,
            });
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
