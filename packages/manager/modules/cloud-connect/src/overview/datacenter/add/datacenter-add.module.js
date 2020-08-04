import angular from 'angular';

import component from './datacenter-add.component';
import routing from './datacenter-add.routing';

const moduleName = 'ovhCloudConnectDatacenterAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDatacenterAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
