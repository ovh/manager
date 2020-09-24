import map from 'lodash/map';
import find from 'lodash/find';

import { STATUS } from './enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database', {
    component: 'enterpriseCloudDatabaseComponent',
    url: '/enterprise-cloud-database',
    resolve: {
      user: /* @ngInject */ (enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getMe(),
      offers: /* @ngInject */ (enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getOffers(),
      catalog: /* @ngInject */ (enterpriseCloudDatabaseService, user) =>
        enterpriseCloudDatabaseService.getCatalog(user.ovhSubsidiary),
      capabilities: /* @ngInject */ (
        offers,
        catalog,
        enterpriseCloudDatabaseService,
      ) =>
        enterpriseCloudDatabaseService.constructor.getCapabilities(
          catalog,
          offers,
        ),
      clusters: /* @ngInject */ (
        $q,
        enterpriseCloudDatabaseService,
        getClusterDetails,
      ) =>
        enterpriseCloudDatabaseService
          .getClusters()
          .then((clusters) =>
            $q.all(map(clusters, (clusterId) => getClusterDetails(clusterId))),
          ),
      getClusterDetails: /* @ngInject */ (
        capabilities,
        enterpriseCloudDatabaseService,
      ) => (clusterId) =>
        enterpriseCloudDatabaseService
          .getClusterDetails(clusterId)
          .then((details) => ({
            offer: find(capabilities, { name: details.offerName }),
            details,
          })),
      gettingStarted: /* @ngInject */ ($state) => (clusterId) =>
        $state.go('enterprise-cloud-database.service.get-started', {
          clusterId,
        }),
      manageCluster: /* @ngInject */ ($state) => (clusterId) =>
        $state.go('enterprise-cloud-database.service.details.overview', {
          clusterId,
        }),
      createCluster: /* @ngInject */ ($state) => () =>
        $state.go('enterprise-cloud-database.create'),
      goToMyServices: /* @ngInject */ ($window) => (
        serviceName,
        serviceType,
      ) => {
        $window.location.replace(
          `#/billing/autoRenew?searchText=${serviceName}&selectedType=${serviceType}`,
        );
        $window.location.reload();
      },
      paymentMethodURL: /* @ngInject */ () => '#/billing/payment/method',
      getOrdersURL: /* @ngInject */ () => (orderId) =>
        `#/billing/orders?status=all&orderId=${orderId}`,
      goBackToList: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = STATUS.SUCCESS,
        clusterId = null,
      ) => {
        const reload = message && type === STATUS.SUCCESS;
        const state = 'enterprise-cloud-database';
        const promise = $state.go(
          state,
          {
            clusterId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
      refreshClusterList: /* @ngInject */ (
        $state,
        enterpriseCloudDatabaseService,
      ) => () => {
        enterpriseCloudDatabaseService.resetClusterListCache();
        return $state.reload();
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('enterprise_cloud_database_title'),
      hideBreadcrumb: () => true,
    },
  });
};
