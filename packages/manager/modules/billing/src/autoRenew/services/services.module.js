import angular from 'angular';

import component from './services.component';
import routing from './services.routing';

import resiliateModule from './resiliate';

const moduleName = 'ovhManagerBillingAutorenewServices';

angular
  .module(moduleName, [resiliateModule])
  .config(routing)
  .component('services', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
