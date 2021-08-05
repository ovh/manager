import angular from 'angular';
import '@ovh-ux/ui-kit';

import blocks from './blocks';
import cloudArchive from './cloud-archives';
import databases from './databases';
import instanceBackups from './instance-backups';
import objectStorage from './object-storage';
import snapshots from './snapshots';
import routing from './storages.routing';

const moduleName = 'ovhManagerPciStorages';

angular
  .module(moduleName, [
    blocks,
    cloudArchive,
    databases,
    instanceBackups,
    'oui',
    snapshots,
    objectStorage,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
