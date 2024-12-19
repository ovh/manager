import routing from './database-order.routing';
import databaseOrderComponent from './database-order.component';

const moduleName = 'ovhManagerHostingDatabaseOrder';

angular
  .module(moduleName, [])
  .component('hostingDatabaseOrderComponent', databaseOrderComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
