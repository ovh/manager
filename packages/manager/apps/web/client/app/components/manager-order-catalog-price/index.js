import angular from 'angular';
import component from './manager-order-catalog-price.component';

const moduleName = 'ovhManagerOrderCatalogPrice';

angular
  .module(moduleName, [])
  .component('ovhManagerOrderCatalogPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
