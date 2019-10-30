import moduleExchange from '@ovh-ux/manager-exchange';


import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular.module(moduleName, [
  'ui.router',
  moduleExchange,
])
  .config(routing);

export default moduleName;
