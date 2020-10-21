import component from './terminate.component';

const moduleName = 'ovhManagerBillingAutorenewTerminate';

angular
  .module(moduleName, ['ui.router'])
  .component('billingAutorenewTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
