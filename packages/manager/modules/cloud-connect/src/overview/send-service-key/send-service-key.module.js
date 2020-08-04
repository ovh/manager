import angular from 'angular';

import component from './send-service-key.component';
import routing from './send-service-key.routing';

const moduleName = 'ovhCloudConnectSendServiceKey';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectSendServiceKey', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
