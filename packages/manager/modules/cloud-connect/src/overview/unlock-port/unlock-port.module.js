import angular from 'angular';

import component from './unlock-port.component';
import routing from './unlock-port.routing';

const moduleName = 'ovhCloudConnectUnlockPort';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectUnlockPort', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
