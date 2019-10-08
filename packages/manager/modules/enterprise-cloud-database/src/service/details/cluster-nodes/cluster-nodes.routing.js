import each from 'lodash/each';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.cluster-nodes', {
    cache: false,
    component: 'enterpriseCloudDatabaseServiceDetailsClusterSizeComponent',
    resolve: {
      addReplicas: /* @ngInject */ ($state, clusterId, hosts) => () => $state.go('enterprise-cloud-database.service.details.cluster-nodes.add', {
        clusterId, hostList: hosts, createReplicas: true,
      }),
      deleteReplicas: /* @ngInject */ ($state, clusterId) => () => $state.go('enterprise-cloud-database.service.details.cluster-nodes.delete', { clusterId }),
      hosts: /* @ngInject */
        (clusterId, enterpriseCloudDatabaseService, planCatalog) => enterpriseCloudDatabaseService
          .getHostsWithDetails(clusterId)
          .then(hosts => each(hosts, (host) => {
            set(host, 'ram', get(planCatalog, 'memory.size', 0));
            set(host, 'storage', get(planCatalog, 'storage'));
          })),
      planCatalog: /* @ngInject */
        (capabilities, clusterDetails) => find(capabilities, { name: clusterDetails.offerName }),
      refreshNodes: /* @ngInject */
        ($state, enterpriseCloudDatabaseService) => () => {
          enterpriseCloudDatabaseService.resetHostsCache();
          return $state.reload();
        },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/cluster-nodes',
  });
};
