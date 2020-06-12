import angular from 'angular';
import '@ovh-ux/ui-kit';

import blocks from './blocks';
import cloudArchive from './cloud-archives';
import instanceBackups from './instance-backups';
import objects from './objects';
import snapshots from './snapshots';
import routing from './storages.routing';

const moduleName = 'ovhManagerPciStorages';

angular
  .module(moduleName, [
    blocks,
    cloudArchive,
    instanceBackups,
    'oui',
    objects,
    snapshots,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
