import angular from 'angular';
import priceComponent from './price.component';

const moduleName = 'ovhManagerPrivateRegistryPrice';

angular
  .module(moduleName, [])
  .component('privateRegistryPrice', priceComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
