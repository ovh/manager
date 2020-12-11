import billing from '@ovh-ux/manager-billing';
import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerBillingAutorenewDelete';

angular
  .module(moduleName, ['ui.router', billing])
  .config(routing)
  .component('billingAutorenewDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
