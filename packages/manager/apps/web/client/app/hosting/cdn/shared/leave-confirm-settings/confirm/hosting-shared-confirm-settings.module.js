import component from './hosting-shared-confirm-settings.component';
import routing from './hosting-shared-confirm-settings.routing';

const moduleName = 'ovhManagerHostingSharedLeaveConfirmSettings';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('managerHostingSharedConfirmSettings', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
