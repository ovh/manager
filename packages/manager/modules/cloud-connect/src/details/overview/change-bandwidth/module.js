import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhCloudConnectDetailsChangeBandwidth';

angular
  .module(moduleName, [])
  .config(routing)
  .service('changeBandwidthService', service)
  .component('cloudConnectDetailsChangeBandwidth', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
