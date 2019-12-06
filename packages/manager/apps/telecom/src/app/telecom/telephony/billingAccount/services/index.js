import angular from 'angular';

import component from './services.component';
import routing from './services.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountServices';

angular
  .module(moduleName, [])
  .config(routing)
  .component('telecomTelephonyBillingAccountServices', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
