import component from './hosting-database-order-private.component';
import routing from './hosting-database-order-private.routing';
import service from './hosting-database-order-private.service';

const moduleName = 'ovhManagerHostingDatabaseOrderPrivate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('hostingDatabaseOrderPrivate', component)
  .service('HostingDatabaseOrderPrivateService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
