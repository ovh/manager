import angular from 'angular';

import component from './lock-port.component';
import routing from './lock-port.routing';

const moduleName = 'ovhCloudConnectLockPort';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectLockPort', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
