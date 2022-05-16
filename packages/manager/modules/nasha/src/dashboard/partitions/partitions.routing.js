import { INSTANCE_STATE_NAME, STATE_NAME } from './partitions.constants';

export default /* @ngInject */ ($stateProvider) => {
  const goToPagePartitionResolve = [
    { id: '', name: '' },
    { id: 'access', name: 'Access' },
    { id: 'snapshots', name: 'Snapshots' },
  ].reduce((resolve, { id, name }) => {
    const resolveName = `goToPagePartition${name}`;
    const stateName = `nasha.dashboard.partition${id ? `.${id}` : ''}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partitionName) =>
        $state.go(stateName, {
          serviceName,
          partitionName,
        }),
    };
  }, {});

  const goToTabPartitionsResolve = [
    { id: 'create', name: 'Create', instance: false },
    { id: 'delete', name: 'Delete', instance: true },
    { id: 'edit-size', name: 'EditSize', instance: true },
    { id: 'zfs-options', name: 'ZfsOptions', instance: true },
  ].reduce((resolve, { id, name, instance }) => {
    const resolveName = `goToTabPartitions${name}`;
    const stateName = `${instance ? INSTANCE_STATE_NAME : STATE_NAME}.${id}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partition) =>
        $state.go(stateName, {
          serviceName,
          partitionName: partition?.partitionName,
          partition,
        }),
    };
  }, {});

  $stateProvider.state(STATE_NAME, {
    url: '/partitions',
    component: 'nashaDashboardPartitions',
    resolve: {
      breadcrumb: () => null,
      urlRenew: /* @ngInject */ (serviceName, coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
          selectedType: 'DEDICATED_NASHA',
          searchText: serviceName,
        }),
      partitionsHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(STATE_NAME, { serviceName }),
      tasks: /* @ngInject */ (iceberg, nashaApiUrl, NashaTask) =>
        iceberg(`${nashaApiUrl}/task`)
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('status', 'in', Object.values(NashaTask.status))
          .execute(null, true)
          .$promise.then(({ data }) => data),
      ...goToPagePartitionResolve,
      ...goToTabPartitionsResolve,
    },
  });

  $stateProvider.state(INSTANCE_STATE_NAME, {
    abstract: true,
    url: '/:partitionName',
    params: {
      partition: null,
    },
    resolve: {
      breadcrumb: () => null,
      partition: /* @ngInject */ ($transition$, $http, partitionApiUrl) =>
        $transition$.params().partition ||
        $http.get(partitionApiUrl).then(({ data }) => data),
      partitionApiUrl: /* @ngInject */ (nashaApiUrl, partitionName) =>
        `${nashaApiUrl}/partition/${partitionName}`,
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
    },
  });
};
