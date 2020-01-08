import component from './form.component';
import service from './form.service';

const moduleName = 'ovhManagerBillingAutorenewUpdateForm';

angular
  .module(moduleName, [])
  .component('billingAutorenewUpdateForm', component)
  .service('BillingAutorenewUpdateForm', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
