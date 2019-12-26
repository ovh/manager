import component from './vps-additional-disk.component';
import routing from './vps-additional-disk.routing';

import ovhManagerVpsAdditionnalDiskOrder from './order';

const moduleName = 'ovhManagerVpsAdditionnalDisk';

angular
  .module(moduleName, [ovhManagerVpsAdditionnalDiskOrder])
  .component(component.name, component)
  .config(routing);

export default moduleName;
