import angular from 'angular';

import component from './delete-replication.component';
import routing from './delete-replication.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseReplicationsDeleteReplication';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseReplicationsDeleteReplicationComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
