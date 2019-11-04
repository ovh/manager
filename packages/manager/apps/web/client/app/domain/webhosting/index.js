import order from './order';

import routing from './domain-webhosting.routing';

const moduleName = 'ovhManagerWebDomainWebhostingModule';

angular
  .module(moduleName, [
    order,
  ])
  .config(routing);

export default moduleName;
