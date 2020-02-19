import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-additional-disk.component';
import routing from './vps-additional-disk.routing';

import ovhManagerVpsAdditionnalDiskOrder from './order';

const moduleName = 'ovhManagerVpsAdditionnalDisk';

angular
  .module(moduleName, [ovhManagerVpsAdditionnalDiskOrder, 'ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
