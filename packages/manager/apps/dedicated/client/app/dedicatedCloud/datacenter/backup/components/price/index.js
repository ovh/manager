import angular from 'angular';
import priceComponent from './price.component';

const moduleName = 'ovhManagerDedicatedPrice';

angular
  .module(moduleName, [])
  .component('dedicatedPrice', priceComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
