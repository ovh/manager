import angular from 'angular';
import '@uirouter/angularjs';
import manualBackupComponent from './manual-backup.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsBackupsManual';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.backups.manual',
        {
          url: '/manual-backup',
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsBackupsManualComponent',
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
    'enterpriseCloudDatabaseServiceDetailsBackupsManualComponent',
    manualBackupComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
