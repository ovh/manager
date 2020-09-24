import angular from 'angular';
import '@uirouter/angularjs';
import grantAdpAccessComponent from './grant-access.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsLogsGrantAccess';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.logs.grant-access',
        {
          url: '/grant-access',
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsLogsGrantAccessComponent',
            },
          },
          layout: 'modal',
          resolve: {
            breadcrumb: () => null,
          },
        },
      );
    },
  )
  .component(
    'enterpriseCloudDatabaseServiceDetailsLogsGrantAccessComponent',
    grantAdpAccessComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
