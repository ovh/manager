import angular from 'angular';
import '@uirouter/angularjs';
import restoreComponent from './restore.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsBackupsRestore';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.backups.restore',
        {
          url: '/restore',
          params: {
            backupInstance: null,
          },
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsBackupsRestoreComponent',
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
    'enterpriseCloudDatabaseServiceDetailsBackupsRestoreComponent',
    restoreComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
