import moduleExchange from '@ovh-ux/manager-exchange';

import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular.module(moduleName, [moduleExchange, 'ui.router']).config(routing);

export default moduleName;
