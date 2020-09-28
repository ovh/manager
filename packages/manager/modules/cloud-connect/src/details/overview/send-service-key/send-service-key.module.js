import angular from 'angular';

import component from './send-service-key.component';
import routing from './send-service-key.routing';

const moduleName = 'ovhCloudConnectDetailsSendServiceKey';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsSendServiceKey', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
