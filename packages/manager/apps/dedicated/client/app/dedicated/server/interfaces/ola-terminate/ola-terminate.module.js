import component from './ola-terminate.component';
import routing from './ola-terminate.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaTerminate';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesOlaTerminate', component);

export default moduleName;
