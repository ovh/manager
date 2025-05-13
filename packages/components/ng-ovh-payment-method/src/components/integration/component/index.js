import angular from 'angular';

import adyen from './adyen';

import component from './component';

const moduleName = 'ngOvhPaymentMethodIntegrationComponent';

angular
  .module(moduleName, [adyen])
  .component('ovhPaymentMethodIntegrationComponent', component);

export default moduleName;
