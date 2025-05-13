import angular from 'angular';

import component from './create-volume.component';
import routing from './create-volume.routing';
import volumeEdit from '../../../blocks/block/edit/volume-edit';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupListCreateVolume';

angular
  .module(moduleName, [volumeEdit])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupListCreateVolume',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
