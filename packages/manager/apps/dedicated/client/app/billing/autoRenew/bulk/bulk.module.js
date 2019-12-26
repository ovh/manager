import component from './bulk.component';

const moduleName = 'ovhManagerBillingAutorenewBulk';

angular
  .module(moduleName, [])
  .component('billingAutorenewBulk', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
