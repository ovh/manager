import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

import vpsTileStatusItem from './vpsTileStatus/vps-tile-status.component';

import ovhManagerVpsDashboardRebuild from './rebuild';
import ovhManagerVpsDashboardTerminate from './terminate';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [
    ovhManagerVpsDashboardRebuild,
    ovhManagerVpsDashboardTerminate,
  ])
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing);

export default moduleName;
