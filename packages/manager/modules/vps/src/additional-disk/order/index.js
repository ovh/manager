import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-order-additional-disk-order.routing';

import additionalDiskOptionsFilter from './legacy/additional-disk-option.filter';

const moduleName = 'ovhManagerVpsAdditionnalDiskOrder';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .filter('vpsAdditionalDiskOptions', additionalDiskOptionsFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
