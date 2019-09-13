import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

import vpsTileStatusItem from './vpsTileStatus/vps-tile-status.component';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing);

export default moduleName;
