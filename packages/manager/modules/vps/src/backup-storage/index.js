import component from './vps-backup-storage.component';
import routing from './vps-backup-storage.routing';

import ovhManagerVpsBackupStorageOrder from './order';

const moduleName = 'ovhManagerVpsBackupStorage';

angular
  .module(moduleName, [ovhManagerVpsBackupStorageOrder])
  .component(component.name, component)
  .config(routing);

export default moduleName;
