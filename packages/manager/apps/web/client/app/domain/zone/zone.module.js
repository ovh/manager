import routing from './zone.routing';

import zoneActivate from './activate';

const moduleName = 'ovhManagerWebDomainZone';

angular
  .module(moduleName, [zoneActivate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
