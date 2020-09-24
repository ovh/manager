import { STATUS, ADP_URL } from '../../../enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.logs', {
    url: '/logs',
    cache: false,
    component: 'enterpriseCloudDatabaseServiceDetailsLogsComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('enterprise_cloud_database_service_details_logs'),
      goBackToLogs: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = STATUS.SUCCESS,
      ) => {
        const reload = message && type === STATUS.SUCCESS;
        const state = 'enterprise-cloud-database.service.details.logs';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },
      grantAccess: /* @ngInject */ ($state, clusterId) => () => {
        $state.go(
          'enterprise-cloud-database.service.details.logs.grant-access',
          {
            clusterId,
          },
        );
      },
      ldpHomeUrl: /* @ngInject */ (coreConfig) =>
        ADP_URL[coreConfig.getRegion()],
      logs: /* @ngInject */ (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getLogs(clusterId),
      revokeAccess: /* @ngInject */ ($state, clusterId) => (ldpAccount) => {
        $state.go(
          'enterprise-cloud-database.service.details.logs.revoke-access',
          {
            clusterId,
            ldpAccount,
            logId: ldpAccount.id,
          },
        );
      },
      refreshLogs: /* @ngInject */ (
        $state,
        enterpriseCloudDatabaseService,
      ) => () => {
        enterpriseCloudDatabaseService.resetLogsCache();
        return $state.reload();
      },
    },
  });
};
