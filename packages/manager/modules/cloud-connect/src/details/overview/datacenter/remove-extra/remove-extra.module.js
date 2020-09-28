import angular from 'angular';

import component from './remove-extra.component';
import routing from './remove-extra.routing';

const moduleName = 'ovhCloudConnectDetailsRemoveExtra';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsRemoveExtra', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
