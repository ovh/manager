import angular from 'angular';
import passwordComponent from './password.component';

const moduleName = 'enterpriseCloudDatabaseServicePassword';

angular
  .module(moduleName, [])
  .component('enterpriseCloudDatabaseServicePasswordComponent', passwordComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
