import automatic from './automatic/automatic.module';
import form from './form/form.module';
import manualPayment from './manualPayment/manualPayment.module';
import noPaymentMean from './noPaymentMean/noPaymentMean.module';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerBillingAutorenewUpdate';

angular
  .module(moduleName, [automatic, form, manualPayment, noPaymentMean])
  .config(routing)
  .component('billingAutorenewUpdate', component);

export default moduleName;
