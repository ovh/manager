import routing from './zone.routing';

import zoneActivate from './activate';
import zoneHistory from './history';

const moduleName = 'ovhManagerWebDomainZone';

angular
  .module(moduleName, [zoneActivate, zoneHistory])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
