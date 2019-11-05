import component from './vps-secondary-dns.component';
import routing from './vps-secondary-dns.routing';

const moduleName = 'ovhManagerVpsSecondaryDns';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing);

export default moduleName;
