import angular from 'angular';

import component from './restore-volume.component';
import routing from './restore-volume.routing';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupListRestoreVolume';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupListRestoreVolume',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
