import angular from 'angular';

import component from './unlock-port.component';
import routing from './unlock-port.routing';

const moduleName = 'ovhCloudConnectDetailsUnlockPort';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsUnlockPort', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
