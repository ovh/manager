import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import blocks from './blocks';
import cloudArchive from './cloud-archives';
import instanceBackups from './instance-backups';
import objectStorage from './object-storage';
import coldArchive from './cold-archive';
import snapshots from './snapshots';
import storagesComponents from './components';
import volumeBackup from './volume-backup';
import activateProjectBanner from '../components/activate-project-banner';

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
    instanceBackups,
    objectStorage,
    coldArchive,
    snapshots,
    volumeBackup,
    activateProjectBanner,
  ])
  .service('PciStoragesUsersService', storageUsersService)
  .config(routing);

export default moduleName;
