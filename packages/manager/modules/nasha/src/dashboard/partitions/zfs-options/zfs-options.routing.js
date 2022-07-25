import { ZFS_OPTIONS_RESOLVE } from '../../../components/partition/zfs-options';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.zfs-options', {
    url: '/zfs-options',
    component: 'nashaComponentsPartitionZfsOptions',
    resolve: {
      breadcrumb: () => null,
      ...ZFS_OPTIONS_RESOLVE,
    },
  });
};
