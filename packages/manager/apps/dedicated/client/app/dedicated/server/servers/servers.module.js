import component from './servers.component';
import routing from './servers.routing';

const moduleName = 'ovhManagerDedicatedServerServers';

angular
  .module(moduleName, [])
  .component('dedicatedServerServers', component)
  .config(routing);

export default moduleName;
