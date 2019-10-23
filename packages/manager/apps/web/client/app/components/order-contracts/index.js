import angular from 'angular';
import component from './order-contracts.component';

const moduleName = 'orderContracts';

angular
  .module(moduleName, [])
  .component('orderContracts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
