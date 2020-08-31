export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partitions', {
    url: '/partitions',
    views: {
      nashaPartition: {
        component: 'nashaPartitionComponent',
      },
    },
    onEnter: (CucCloudMessage) => CucCloudMessage.flushMessages(),
    translations: {
      value: [
        '../../common',
        '.',
        './add',
        './delete',
        './update',
        './snapshot',
        './custom-snapshot',
        './zfs-options',
      ],
      format: 'json',
    },
    params: {
      partition: null,
      tasks: null,
      isNew: null,
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().nashaId,
      partition: /* @ngInject */ ($transition$) =>
        $transition$.params().partition,
      tasks: /* @ngInject */ ($transition$) => $transition$.params().tasks,
      isNew: /* @ngInject */ ($transition$) => $transition$.params().isNew,
      goToPartitionAdd: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('nasha.dashboard.nasha-partitions.add', {
          serviceName,
        }),
      goToPartitionCustomSnapshot: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go('nasha.dashboard.nasha-partitions.custom-snapshot', {
          serviceName,
          partition,
        }),
      goToPartitionDelete: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go('nasha.dashboard.nasha-partitions.delete', {
          serviceName,
          partition,
        }),
      goToPartitionSnapshot: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go('nasha.dashboard.nasha-partitions.snapshot', {
          serviceName,
          partition,
        }),
      goToPartitionUpdate: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go('nasha.dashboard.nasha-partitions.update', {
          serviceName,
          partition,
        }),
      goToPartitionZfsOptions: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go('nasha.dashboard.nasha-partitions.zfs-options', {
          serviceName,
          partition,
        }),
      goToPartitionPage: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
      ) => {
        const state = 'nasha.dashboard.nasha-partitions';
        const promise = $state.go(state, data);
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
      breadcrumb: () => null,
    },
  });
};
