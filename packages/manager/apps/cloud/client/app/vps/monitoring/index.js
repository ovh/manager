import component from './vps-monitoring.component';
import routing from './vps-monitoring.routing';

const moduleName = 'ovhManagerVpsMonitoring';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing);

export default moduleName;
