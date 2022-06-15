import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

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
    snapshots,
    objectStorage,
    'oui',
    'ui.router',
    'ovhManagerFilters',
  ])
  .config(routing);

export default moduleName;
