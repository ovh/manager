import angular from 'angular';
import securityGroupNameComponent from './security-group-name.component';

const moduleName = 'enterpriseCloudDatabaseServiceSecurityGroupName';

angular
  .module(moduleName, [])
  .component('enterpriseCloudDatabaseServiceSecurityGroupNameComponent', securityGroupNameComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
