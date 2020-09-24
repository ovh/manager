import angular from 'angular';
import '@uirouter/angularjs';
import deleteRestoredInstanceComponent from './delete.component';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsRestoredInstancesDelete';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.restored-instances.delete',
        {
          url: '/delete',
          params: {
            instanceId: null,
          },
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDeleteRestoredInstanceComponent',
            },
          },
          layout: 'modal',
          resolve: {
            instanceId: /* @ngInject */ ($transition$) =>
              $transition$.params().instanceId,
            breadcrumb: () => null,
          },
        },
      );
    },
  )
  .component(
    'enterpriseCloudDatabaseServiceDeleteRestoredInstanceComponent',
    deleteRestoredInstanceComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
