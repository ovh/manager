import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular.module(moduleName, [
  'ui.router',
])
  .config(routing);

export default moduleName;
