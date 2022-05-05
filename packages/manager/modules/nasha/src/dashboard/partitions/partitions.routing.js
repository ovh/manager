import { STATE_NAME } from './partitions.constants';

export default /* @ngInject */ ($stateProvider) => {
  const goToPagePartitionResolve = [
    { id: 'access', name: 'Access' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'snapshots', name: 'Snapshots' },
  ].reduce(
    (resolves, { id, name }) => ({
      ...resolves,
      [`goToPagePartition${name}`]: /* @ngInject */ ($state, serviceName) => (
        partitionName,
      ) => $state.go(`nasha.partition.${id}`, { serviceName, partitionName }),
    }),
    {},
  );

  const goToTabPartitionsResolve = [
    { id: 'create', name: 'Create' },
    { id: 'delete', name: 'Delete' },
    { id: 'edit-size', name: 'EditSize' },
    { id: 'zfs-options', name: 'ZfsOptions' },
  ].reduce(
    (resolves, { id, name }) => ({
      ...resolves,
      [`goToTabPartitions${name}`]: /* @ngInject */ ($state, serviceName) => (
        partition,
      ) =>
        $state.go(`${STATE_NAME}.${id}`, {
          serviceName,
          partition,
          partitionName: partition?.partitionName,
        }),
    }),
    {},
  );

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
      ...goToPagePartitionResolve,
      ...goToTabPartitionsResolve,
    },
  });
};
