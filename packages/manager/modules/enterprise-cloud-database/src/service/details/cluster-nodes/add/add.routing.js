import { MESSAGE_CONTAINER } from '../../details.constants';
import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'enterprise-cloud-database.service.details.cluster-nodes.add',
    {
      layout: 'modal',
      params: {
        createReplicas: null,
        hostList: null,
      },
      resolve: {
        /* @ngInject */
        availableReplicas: (clusterDetails, enterpriseCloudDatabaseService) =>
          enterpriseCloudDatabaseService
            .getHostCount(clusterDetails.offerName, clusterDetails.regionName)
            .then((hostCountDetails) => hostCountDetails.hostLeft),
        createReplicas: /* @ngInject */ ($transition$) =>
          $transition$.params().createReplicas,
        goBack: /* @ngInject */ (
          $state,
          clusterId,
          CucCloudMessage,
          CucControllerHelper,
        ) => (message = false, type = STATUS.SUCCESS) => {
          const reload = message && type === STATUS.SUCCESS;
          const promise = $state.go(
            'enterprise-cloud-database.service.details.cluster-nodes',
            { clusterId },
            { reload },
          );
          if (message) {
            promise.then(() => {
              CucCloudMessage[type]({ textHtml: message }, MESSAGE_CONTAINER);
              CucControllerHelper.scrollPageToTop();
            });
          }
          return promise;
        },
        hostList: /* @ngInject */ ($transition$) =>
          $transition$.params().hostList,
        /* @ngInject */
        maxHostCount: (clusterDetails, enterpriseCloudDatabaseService) =>
          enterpriseCloudDatabaseService
            .getOfferDetails(clusterDetails.offerName)
            .then((offer) => offer.maxHostCount),
        /* @ngInject */
        nodeCatalog: (planCatalog) => planCatalog.node,
        orderUrl: /* @ngInject */ (getOrdersURL) => getOrdersURL,
        breadcrumb: () => null,
      },
      translations: {
        value: ['../../../add-replicas'],
        format: 'json',
      },
      url: '/add',
      views: {
        modal: {
          component: 'enterpriseCloudDatabaseServiceAddReplicasComponent',
        },
      },
    },
  );
};
