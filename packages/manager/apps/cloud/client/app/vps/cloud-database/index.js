import component from './vps-cloud-database.component';
import routing from './vps-cloud-database.routing';

import ovhManagerVpsCloudDatabaseOrder from './order';

const moduleName = 'ovhManagerVpsCloudDatabase';

angular
  .module(moduleName, [
    ovhManagerVpsCloudDatabaseOrder,
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
