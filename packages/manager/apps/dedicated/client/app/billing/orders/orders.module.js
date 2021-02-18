import retraction from './retraction/retraction.module';

import routing from './orders.routing';

const moduleName = 'ovhManagerBillingOrders';

angular.module(moduleName, ['ui.router', retraction]).config(routing);

export default moduleName;
