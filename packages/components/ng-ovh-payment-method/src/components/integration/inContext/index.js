import angular from 'angular';

import component from './component';

import paypal from './paypal';

const moduleName = 'ngOvhPaymentMethodIntegrationInContext';

angular
  .module(moduleName, [
    paypal,
  ])
  .component(component.name, component);

export default moduleName;
