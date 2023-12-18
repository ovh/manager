import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import pciBlockStorage from '@ovh-ux/manager-pci-block-storage';
import cloudArchive from '../cloud-archives';
import coldArchive from '../cold-archive';
import databases from '../databases';
import instanceBackups from '../instance-backups';
import objectStorage from './object-storage';
import snapshots from '../snapshots';
import volumeBackup from '../volume-backup';

import routing from './storages.routing';

const moduleName = 'ovhManagerPciStorages';

angular
  .module(moduleName, [
    pciBlockStorage,
    cloudArchive,
    coldArchive,
    databases,
    instanceBackups,
    snapshots,
    objectStorage,
    volumeBackup,
    'oui',
    'ui.router',
    'ovhManagerFilters',
  ])
  .config(routing);

export default moduleName;
