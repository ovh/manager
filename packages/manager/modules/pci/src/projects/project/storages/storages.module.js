import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import blocks from './blocks';
import cloudArchive from './cloud-archives';
import databases from './databases';
import instanceBackups from './instance-backups';
import objectStorage from './object-storage';
import snapshots from './snapshots';
import storagesComponents from './components';
import volumeBackup from './volume-backup';

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
    objectStorage,
    snapshots,
    storagesComponents,
    volumeBackup,
  ])
  .service('PciStoragesUsersService', storageUsersService)
  .config(routing);

export default moduleName;
