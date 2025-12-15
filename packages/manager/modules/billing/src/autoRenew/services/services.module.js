import angular from 'angular';

import component from './services.component';
import reasonWarningModule from './reason-warning-modal';
import routing from './services.routing';

import resiliateModule from './resiliate';

import service from './service/service.service';

const moduleName = 'ovhManagerBillingAutorenewServices';

angular
  .module(moduleName, [resiliateModule, reasonWarningModule])
  .config(routing)
  .component('services', component)
  .service('ServiceService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
