import component from './vps-veeam.component';
import routing from './vps-veeam.routing';

import ovhManagerVpsVeeamOrder from './order';

const moduleName = 'ovhManagerVpsVeeam';

angular
  .module(moduleName, [ovhManagerVpsVeeamOrder])
  .component(component.name, component)
  .config(routing);

export default moduleName;
