import component from './manualPayment.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateManualPayment';

angular
  .module(moduleName, [])
  .component('billingAutorenewUpdateManualPayment', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
