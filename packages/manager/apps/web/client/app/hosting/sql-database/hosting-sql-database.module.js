import routing from './hosting-sql-database.routing';

import order from './order/hosting-sql-database-order.module';

const moduleName = 'ovhManagerHostingSqlDatabase';

angular
  .module(moduleName, [
    order,
  ])
  .config(routing);

export default moduleName;
