import angular from 'angular';

import component from './tasks.component';
import routing from './tasks.routing';

const moduleName = 'ovhCloudConnectTasks';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
