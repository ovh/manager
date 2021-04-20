import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-veeam.component';
import routing from './vps-veeam.routing';

import ovhManagerVpsVeeamOrder from './order';
import ovhManagerVpsVeeamScheduleBackup from './modal/schedule-backup';
import ovhManagerVpsVeeamRestore from './modal/restore';
import ovhManagerVpsVeeamMount from './modal/mount';

const moduleName = 'ovhManagerVpsVeeam';

angular
  .module(moduleName, [
    ovhManagerVpsVeeamMount,
    ovhManagerVpsVeeamOrder,
    ovhManagerVpsVeeamRestore,
    ovhManagerVpsVeeamScheduleBackup,
    'ui.router',
  ])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
