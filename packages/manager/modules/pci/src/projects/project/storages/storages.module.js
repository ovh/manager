import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import blocks from './blocks';
import cloudArchive from './cloud-archives';
import databases from './databases';
import instanceBackups from './instance-backups';
import objectStorage from './object-storage';
import coldArchive from './cold-archive';
import snapshots from './snapshots';
import storagesComponents from './components';

import routing from './storages.routing';
import storageUsersService from './storage-users.service';

const moduleName = 'ovhManagerPciStorages';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ovhManagerFilters',
    blocks,
    cloudArchive,
    databases,
    instanceBackups,
    snapshots,
    objectStorage,
    coldArchive,
    storagesComponents,
  ])
  .service('PciStoragesUsersService', storageUsersService)
  .config(routing);

export default moduleName;
