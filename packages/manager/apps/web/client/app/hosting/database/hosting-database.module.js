import routing from './hosting-database.routing';

import orderPrivate from './order-private/hosting-database-order-private.module';

const moduleName = 'ovhManagerHostingDatabase';

angular.module(moduleName, [orderPrivate]).config(routing);

export default moduleName;
