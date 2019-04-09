import angular from 'angular';
import 'ovh-ui-angular';

import blocks from './blocks';
import snapshots from './snapshots';
import routing from './storages.routing';

const moduleName = 'ovhManagerPciStorages';

angular
  .module(moduleName, [
    blocks,
    snapshots,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
