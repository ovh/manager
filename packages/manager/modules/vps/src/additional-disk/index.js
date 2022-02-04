import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-additional-disk.component';
import routing from './vps-additional-disk.routing';

import ovhManagerVpsAdditionalDiskOrder from './order';
import ovhManagerVpsAdditionalDiskTerminate from './terminate';

const moduleName = 'ovhManagerVpsAdditionalDisk';

angular
  .module(moduleName, [
    ovhManagerVpsAdditionalDiskOrder,
    ovhManagerVpsAdditionalDiskTerminate,
    'ui.router',
  ])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
