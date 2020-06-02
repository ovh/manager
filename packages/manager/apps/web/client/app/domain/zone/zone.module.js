import routing from './zone.routing';

import activate from './activate/activate.module';
import detach from './detach/detach.module';

const moduleName = 'ovhManagerWebDomainZone';

angular
  .module(moduleName, [activate, detach])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
