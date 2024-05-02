import angular from 'angular';
import 'angular-translate';

import hubTile from '../tile';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerHubCatalogItems';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', hubTile])
  .component('hubCatalogItems', component)
  .service('hubCatalogItemsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
