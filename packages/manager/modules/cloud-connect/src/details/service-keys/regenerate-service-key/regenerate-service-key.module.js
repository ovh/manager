import angular from 'angular';

import component from './regenerate-service-key.component';
import routing from './regenerate-service-key.routing';

const moduleName = 'ovhCloudConnectDetailsRegenerateServiceKey';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsRegenerateServiceKey', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
