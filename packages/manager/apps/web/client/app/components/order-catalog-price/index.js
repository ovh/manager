import angular from 'angular';
import component from './order-catalog-price.component';

const moduleName = 'orderCatalogPrice';

angular
  .module(moduleName, [])
  .component('orderCatalogPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
