import routing from './hosting-cdn.routing';

import shared from './shared/hosting-cdn-shared-settings.module';
import order from './order/hosting-cdn-order.module';
import logs from './logs';

const moduleName = 'ovhManagerHostingCdn';

angular
  .module(moduleName, [order, shared, logs])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
