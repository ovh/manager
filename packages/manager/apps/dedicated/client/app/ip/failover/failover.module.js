import angular from 'angular';

import component from './failover.component';
import routing from './failover.routing';

const moduleName = 'ovhManagerIpFailover';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ipFailover', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
