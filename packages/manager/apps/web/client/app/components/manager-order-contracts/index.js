import angular from 'angular';
import component from './manager-order-contracts.component';

const moduleName = 'ovhManagerOrderContracts';

angular
  .module(moduleName, [])
  .component('ovhManagerOrderContracts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
