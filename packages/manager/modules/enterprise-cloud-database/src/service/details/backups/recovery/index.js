import angular from 'angular';
import '@uirouter/angularjs';
import recoveryComponent from './recovery.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsBackupsRecovery';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.backups.recovery',
        {
          url: '/recovery',
          params: {
            minDate: null,
          },
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsBackupsRecoveryComponent',
            },
          },
          layout: 'modal',
          resolve: {
            minDate: /* @ngInject */ ($transition$) =>
              $transition$.params().minDate,
            breadcrumb: () => null,
          },
        },
      );
    },
  )
  .component(
    'enterpriseCloudDatabaseServiceDetailsBackupsRecoveryComponent',
    recoveryComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
