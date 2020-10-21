import component from './email.component';
import routing from './email.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEmail';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .component('billingAutorenewTerminateEmail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
