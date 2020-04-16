import routing from './hosting-database.routing';

import detachPrivate from './detach-private';
import orderPrivate from './order-private/hosting-database-order-private.module';

const moduleName = 'ovhManagerHostingDatabase';

angular.module(moduleName, [detachPrivate, orderPrivate]).config(routing);

export default moduleName;
