import component from './ola-configuration.component';
import routing from './ola-configuration.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaConfiguration';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesOlaConfiguration', component);

export default moduleName;
