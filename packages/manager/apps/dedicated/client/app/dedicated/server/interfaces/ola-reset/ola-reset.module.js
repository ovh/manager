import component from './ola-reset.component';
import routing from './ola-reset.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaReset';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesOlaReset', component);

export default moduleName;
