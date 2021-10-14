import routing from './hosting-cdn.routing';

import shared from './shared/hosting-cdn-shared-settings.module';
import order from './order/hosting-cdn-order.module';
import terminate from './terminate/hosting-cdn-terminate.module';

const moduleName = 'ovhManagerHostingCdn';

angular.module(moduleName, [order, terminate, shared]).config(routing);

export default moduleName;
