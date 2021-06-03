import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';
import component from './private-database.component';
import service from './private-database.service';

const moduleName = 'webOrderPrivateDatabaseComponent';

angular
  .module(moduleName, [ovhManagerProductOffers])
  .component('orderPrivateDatabase', component)
  .service('OrderPrivateDatabaseService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
