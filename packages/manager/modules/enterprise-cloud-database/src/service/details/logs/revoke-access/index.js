import angular from 'angular';
import '@uirouter/angularjs';
import deleteComponent from './revoke-access.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsLogsRevokeAccess';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.logs.revoke-access',
        {
          url: '/revoke-access?logId',
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsLogsRevokeAccessComponent',
            },
          },
          params: {
            ldpAccount: null,
          },
          layout: 'modal',
          resolve: {
            logId: /* @ngInject */ ($stateParams) => $stateParams.logId,
            ldpAccount: /* @ngInject */ ($stateParams) =>
              $stateParams.ldpAccount,
            breadcrumb: () => null,
          },
        },
      );
    },
  )
  .component(
    'enterpriseCloudDatabaseServiceDetailsLogsRevokeAccessComponent',
    deleteComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
