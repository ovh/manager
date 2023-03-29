import angular from 'angular';

import component from './create-volume.component';
import routing from './create-volume.routing';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupListCreateVolume';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupListCreateVolume',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
