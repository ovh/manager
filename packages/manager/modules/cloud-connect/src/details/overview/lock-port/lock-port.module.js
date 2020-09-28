import angular from 'angular';

import component from './lock-port.component';
import routing from './lock-port.routing';

const moduleName = 'ovhCloudConnectDetailsLockPort';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsLockPort', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
