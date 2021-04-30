import component from './hosting-database-order-private.component';
import routing from './hosting-database-order-private.routing';
import orderPrivateDatabase from '../components/private-database/index';

const moduleName = 'ovhManagerHostingDatabaseOrderPrivate';

angular
  .module(moduleName, [orderPrivateDatabase])
  .config(routing)
  .component('hostingDatabaseOrderPrivate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
