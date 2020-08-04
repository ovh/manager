import angular from 'angular';

import component from './remove-datacenter.component';
import routing from './remove-datacenter.routing';

const moduleName = 'ovhCloudConnectRemoveDatacenterConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectRemoveDatacenterConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
