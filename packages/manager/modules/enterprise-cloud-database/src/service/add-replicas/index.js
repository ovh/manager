import angular from 'angular';
import addReplicasComponent from './add-replicas.component';

const moduleName = 'enterpriseCloudDatabaseServiceAddReplicas';

angular
  .module(moduleName, [])
  .component(
    'enterpriseCloudDatabaseServiceAddReplicasComponent',
    addReplicasComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
