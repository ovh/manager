import component from './vps-windows.component';
import routing from './vps-windows.routing';

import ovhManagerVpsWindowsOrder from './order';

const moduleName = 'ovhManagerVpsWindows';

angular
  .module(moduleName, [
    ovhManagerVpsWindowsOrder,
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
