import angular from 'angular';

import component from './remove-extra.component';
import routing from './remove-extra.routing';

const moduleName = 'ovhCloudConnectRemoveExtra';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectRemoveExtra', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
