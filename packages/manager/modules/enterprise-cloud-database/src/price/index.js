import angular from 'angular';
import priceComponent from './price.component';

const moduleName = 'enterpriseCloudDatabasePriceComponent';

angular
  .module(moduleName, [])
  .component('enterpriseCloudDatabasePriceComponent', priceComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
