import component from './hosting-shared-add-edit-cache-rule.component';
import routing from './hosting-shared-add-edit-cache-rule.routing';

const moduleName = 'ovhManagerHostingSharedAddCacheRule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('hostingSharedSettingsAddCacheRule', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
