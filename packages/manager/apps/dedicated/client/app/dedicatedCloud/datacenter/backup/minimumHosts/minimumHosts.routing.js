import { BACKUP_MINIMUM_HOST_COUNT } from '../../../../components/dedicated-cloud/datacenter/backup/backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.minimum-hosts', {
    url: '/minimum-hosts',
    component: 'dedicatedCloudDatacenterBackupMinimumHosts',
    resolve: {
      goToOrderHosts: /* @ngInject */ ($state, productId, datacenterId) => () =>
        $state.go('app.dedicatedClouds.datacenter.hosts.order', {
          datacenterId,
          productId,
        }),
      minimumHosts: () => BACKUP_MINIMUM_HOST_COUNT,
    },
  });
};
