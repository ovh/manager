import angular from 'angular';
import '@uirouter/angularjs';
import deleteComponent from './delete.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsBackupsDelete';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.backups.delete',
        {
          url: '/delete',
          params: {
            backupInstance: null,
          },
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsBackupsDeleteComponent',
            },
          },
          layout: 'modal',
          resolve: {
            backupInstance: /* @ngInject */ ($transition$) =>
              $transition$.params().backupInstance,
            breadcrumb: () => null,
          },
        },
      );
    },
  )
  .component(
    'enterpriseCloudDatabaseServiceDetailsBackupsDeleteComponent',
    deleteComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
