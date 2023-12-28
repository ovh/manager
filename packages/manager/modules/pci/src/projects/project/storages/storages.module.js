import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import pciObjectStorage from '@ovh-ux/manager-pci-object-storage';
import blocks from './blocks';
import cloudArchive from './cloud-archives';
import databases from './databases';
import instanceBackups from './instance-backups';
import coldArchive from './cold-archive';
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
    storagesComponents,
    blocks,
    cloudArchive,
    databases,
    instanceBackups,
    pciObjectStorage,
    coldArchive,
    snapshots,
    volumeBackup,
  ])
  .service('PciStoragesUsersService', storageUsersService)
  .config(routing);

export default moduleName;
