import angular from 'angular';

import component from './statistics.component';
import routing from './statistics.routing';

const moduleName = 'ovhCloudConnectDetailsStatistics';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsStatistics', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
