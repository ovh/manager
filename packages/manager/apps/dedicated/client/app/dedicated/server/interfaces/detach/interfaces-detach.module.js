import component from './interfaces-detach.component';
import routing from './interfaces-detach.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesDetach';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedServerInterfacesDetach', component);

export default moduleName;
