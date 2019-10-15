import component from './ola-activation.component';
import routing from './ola-activation.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaActivation';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedServerInterfacesOlaActivation', component);

export default moduleName;
