import routing from './database-selector.routing';
import databaseSelectorComponent from './database-selector.component';

const moduleName = 'ovhManagerHostingDatabaseSelector';

angular
  .module(moduleName, [])
  .component('hostingDatabaseSelectorComponent', databaseSelectorComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
