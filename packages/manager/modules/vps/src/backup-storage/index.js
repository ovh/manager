import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import component from './vps-backup-storage.component';
import routing from './vps-backup-storage.routing';

import ovhManagerVpsBackupStorageAddStorage from './add';
import ovhManagerVpsBackupStorageDeleteStorage from './delete';
import ovhManagerVpsBackupStorageEditStorage from './edit';
import ovhManagerVpsBackupStorageOrder from './order';
import ovhManagerVpsBackupStoragePassword from './password';

const moduleName = 'ovhManagerVpsBackupStorage';

angular
  .module(moduleName, [
    ovhManagerVpsBackupStorageAddStorage,
    ovhManagerVpsBackupStorageDeleteStorage,
    ovhManagerVpsBackupStorageEditStorage,
    ovhManagerVpsBackupStorageOrder,
    ovhManagerVpsBackupStoragePassword,
    'oui',
    'ui.router',
  ])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
