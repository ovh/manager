import component from './vps-snapshot.component';
import routing from './vps-snapshot.routing';

import ovhManagerVpsSnapshotOrder from './order';

const moduleName = 'ovhManagerVpsSnapshot';

angular
  .module(moduleName, [
    ovhManagerVpsSnapshotOrder,
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
