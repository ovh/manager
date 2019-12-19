import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.get-started.add-replicas', {
    layout: 'modal',
    params: {
      callback: null,
      clusterId: null,
      hostList: null,
    },
    resolve: {
      availableReplicas: /* @ngInject */
      (clusterDetails, enterpriseCloudDatabaseService) => enterpriseCloudDatabaseService
        .getHostCount(clusterDetails.offerName, clusterDetails.regionName)
        .then((hostCountDetails) => hostCountDetails.hostLeft),
      callback: /* @ngInject */ ($transition$) => $transition$.params().callback,
      goBack: /* @ngInject */ ($state, clusterId) => () => $state.go('enterprise-cloud-database.service.get-started', { clusterId }),
      hostList: /* @ngInject */ ($transition$) => $transition$.params().hostList,
      maxHostCount: /* @ngInject */
        (clusterDetails, enterpriseCloudDatabaseService) => enterpriseCloudDatabaseService
          .getOfferDetails(clusterDetails.offerName)
          .then((offer) => offer.maxHostCount),
      nodeCatalog: /* @ngInject */
        (capabilities, clusterDetails) => get(find(capabilities, { name: clusterDetails.offerName }), 'node'),
    },
    translations: {
      value: ['../../add-replicas'],
      format: 'json',
    },
    url: '/add-replicas',
    views: {
      modal: {
        component: 'enterpriseCloudDatabaseServiceAddReplicasComponent',
      },
    },
  });
};
