import angular from 'angular';

import component from './datacenter-add.component';
import routing from './datacenter-add.routing';

const moduleName = 'ovhCloudConnectDetailsDatacenterAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsDatacenterAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
