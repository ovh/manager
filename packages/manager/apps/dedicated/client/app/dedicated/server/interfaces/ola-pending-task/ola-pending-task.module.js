import component from './ola-pending-task.component';
import { routing } from './ola-pending-task.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaPendingTask';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesOlaPendingTask', component);

export default moduleName;
