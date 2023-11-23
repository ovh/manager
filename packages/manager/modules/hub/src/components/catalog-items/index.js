import angular from 'angular';
import 'angular-translate';

import hubTile from '../tile';

import component from './component';

const moduleName = 'ovhManagerHubCatalogItems';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', hubTile])
  .component('hubCatalogItems', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
