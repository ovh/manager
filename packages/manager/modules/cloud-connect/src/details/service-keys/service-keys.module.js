import angular from 'angular';

import component from './service-keys.component';
import routing from './service-keys.routing';
import regenerateServiceKey from './regenerate-service-key';

const moduleName = 'ovhCloudConnectDetailsServiceKeys';

angular
  .module(moduleName, [regenerateServiceKey])
  .config(routing)
  .component('cloudConnectDetailsServiceKeys', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
