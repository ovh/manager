import angular from 'angular';

import ovhManagerHub from '@ovh-ux/manager-hub';

import exchangeRouting from './exchange.routing';
import routing from './routing';

const moduleName = 'ovhManagerHubProductListingPage';

angular
  .module(moduleName, [ovhManagerHub])
  .config(routing)
  .config(exchangeRouting);

export default moduleName;
