import { MESSAGE_CONTAINER } from '../../details.constants';
import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'enterprise-cloud-database.service.details.cluster-nodes.delete',
    {
      layout: 'modal',
      resolve: {
        goBackToClusterSize: /* @ngInject */ (
          $state,
          CucCloudMessage,
          CucControllerHelper,
        ) => (message = false, type = STATUS.SUCCESS) => {
          const reload = message && type === STATUS.SUCCESS;
          const promise = $state.go(
            'enterprise-cloud-database.service.details.cluster-nodes',
            {},
            { reload },
          );
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, MESSAGE_CONTAINER);
              CucControllerHelper.scrollPageToTop();
            });
          }
          return promise;
        },
        breadcrumb: () => null,
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      url: '/delete',
      views: {
        modal: {
          component:
            'enterpriseCloudDatabaseServiceDetailsClusterSizeDeleteComponent',
        },
      },
    },
  );
};
