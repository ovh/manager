import angular from 'angular';
import '@uirouter/angularjs';

import deleteComponent from './delete.component';
import routing from './delete.routing';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsClusterSizeDelete';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseServiceDetailsClusterSizeDeleteComponent',
    deleteComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
