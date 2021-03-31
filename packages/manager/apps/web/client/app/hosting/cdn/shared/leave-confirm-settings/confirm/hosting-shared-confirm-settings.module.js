import component from './hosting-shared-confirm-settings.component';
import routing from './hosting-shared-confirm-settings.routing';

const moduleName = 'ovhManagerHostingSharedConfirmSettings';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('managerHostingSharedConfirmSettings', component);

export default moduleName;
