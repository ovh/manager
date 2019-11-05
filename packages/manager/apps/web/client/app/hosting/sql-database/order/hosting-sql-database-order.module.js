import component from './hosting-sql-database-order.component';
import routing from './hosting-sql-database-order.routing';

const moduleName = 'ovhManagerHostingSqlDatabaseOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .component('hostingSqlDatabaseOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
