import angular from 'angular';
import 'angular-translate';

import hubTile from '../components/tile';

import component from './products.component';

const moduleName = 'ovhManagerHubProducts';

angular
  .module(moduleName, ['pascalprecht.translate', hubTile])
  .component('hubProducts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
