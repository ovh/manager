import angular from 'angular';

import addReplicas from './add';
import deleteReplicas from './delete';
import enterpriseCloudDatabaseServiceDetailsClusterSizeComponent from './cluster-nodes.component';
import routing from './cluster-nodes.routing';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsClusterSize';

angular
  .module(moduleName, [
    addReplicas,
    deleteReplicas,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsClusterSizeComponent', enterpriseCloudDatabaseServiceDetailsClusterSizeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
