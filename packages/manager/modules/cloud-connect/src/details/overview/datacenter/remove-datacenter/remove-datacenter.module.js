import angular from 'angular';

import component from './remove-datacenter.component';
import routing from './remove-datacenter.routing';

const moduleName = 'ovhCloudConnectDetailsRemoveDatacenterConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsRemoveDatacenterConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
