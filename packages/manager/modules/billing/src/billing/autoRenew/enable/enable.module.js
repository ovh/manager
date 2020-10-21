import bulk from '../bulk/bulk.module';

import component from './enable.component';
import routing from './enable.routing';
import service from './enable.service';

const moduleName = 'ovhManagerBillingAutorenewEnable';

angular
  .module(moduleName, ['ui.router', bulk])
  .config(routing)
  .component('billingAutorenewEnable', component)
  .service('BillingAutorenewEnable', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
