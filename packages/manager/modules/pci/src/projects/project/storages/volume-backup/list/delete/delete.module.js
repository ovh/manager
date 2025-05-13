import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupListDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupListDelete',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
