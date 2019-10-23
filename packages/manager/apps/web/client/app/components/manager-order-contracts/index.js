import angular from 'angular';
import component from './manager-order-contracts.component';

const moduleName = 'ovhManagerOrderContracts';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerOrderContracts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
