import angular from 'angular';

import component from './service-keys.component';
import routing from './service-keys.routing';

const moduleName = 'ovhCloudConnectTasks';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
