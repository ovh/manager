import component from './private-database-order-private-sql.component';
import routing from './private-database-order-private-sql.routing';
import orderPrivateDatabase from '../../../hosting/database/order/components/private-database/index';

const moduleName = 'ovhManagerWebPrivateDatabaseOrderPrivateSQL';

angular
  .module(moduleName, [orderPrivateDatabase])
  .config(routing)
  .component('privateDatabaseOrderPrivateSQL', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
