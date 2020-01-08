import component from './automatic.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateAutomatic';

angular
  .module(moduleName, [])
  .component('billingAutorenewUpdateAutomatic', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
