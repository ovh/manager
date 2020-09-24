import angular from 'angular';
import '@uirouter/angularjs';
import updateNameComponent from './update-name.component';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsOverviewUpdateName';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'enterprise-cloud-database.service.details.overview.update-name',
        {
          url: '/update-name',
          params: {
            clusterId: null,
          },
          views: {
            modal: {
              component:
                'enterpriseCloudDatabaseServiceDetailsOverviewUpdateNameComponent',
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
    'enterpriseCloudDatabaseServiceDetailsOverviewUpdateNameComponent',
    updateNameComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
