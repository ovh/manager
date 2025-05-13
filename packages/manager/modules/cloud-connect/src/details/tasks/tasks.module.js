import angular from 'angular';

import component from './tasks.component';
import routing from './tasks.routing';

const moduleName = 'ovhCloudConnectDetailsTasks';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
